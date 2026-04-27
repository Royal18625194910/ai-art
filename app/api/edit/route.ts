import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser, api } from '@/lib/convex-user';
import { createAceDataClient, AceDataError } from '@/lib/acedata-sdk';
import { ConvexClient } from 'convex/browser';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const aceClient = createAceDataClient({
  apiKey: process.env.ACEDATA_API_KEY || '',
  timeout: 300000,
});

function handleError(error: unknown): NextResponse {
  console.error('Edit error:', error);

  if (error instanceof AceDataError) {
    return NextResponse.json(
      { error: error.message, code: error.statusCode, details: error.details },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error', code: 500 },
    { status: 500 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    if (!convexUrl) {
      return NextResponse.json({ error: 'Convex URL not configured', code: 500 }, { status: 500 });
    }

    const convex = new ConvexClient(convexUrl);

    try {
      // 获取或创建用户
      const user = await getOrCreateUser(clerkId);

      if (!user) {
        return NextResponse.json({ error: 'Failed to create user', code: 500 }, { status: 500 });
      }

      // 检查积分
      if (user.credits < 1) {
        return NextResponse.json(
          { error: 'Insufficient credits', code: 402, credits: user.credits },
          { status: 402 }
        );
      }

      const body = await req.json();
      const { prompt, size, images } = body;

      if (!prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required', code: 422 }, { status: 422 });
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        return NextResponse.json(
          { error: 'Images are required for editing', code: 422 },
          { status: 422 }
        );
      }

      // 先将 base64 图片上传到 Convex Storage 获取 URL
      const imageUrls: string[] = [];
      for (const base64Image of images) {
        // 检查是否是 base64 格式
        if (base64Image.startsWith('data:')) {
          const [header, base64Data] = base64Image.split(',');
          const mimeMatch = header.match(/data:(.*?);base64/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

          const result = await convex.action(api.file.storeFile, {
            base64Data,
            mimeType,
          });

          if (!result.url) {
            return NextResponse.json(
              { error: 'Failed to upload image', code: 500 },
              { status: 500 }
            );
          }
          imageUrls.push(result.url);
        } else {
          // 已经是 URL，直接使用
          imageUrls.push(base64Image);
        }
      }

      let generatedImageUrls: string[] = [];
      let taskId: string = '';

      try {
        console.log('[Edit] Calling Ace API with:', { model: 'gpt-image-2', imageCount: imageUrls.length });

        // 先调用 Ace API 编辑图片
        const response = await aceClient.createImageToImage({
          model: 'gpt-image-2',
          image: imageUrls,
          prompt: prompt.trim(),
          size: size || 'auto',
        });
        taskId = response.task_id;
        generatedImageUrls = response.data.map(item => item.url);

        console.log('[Edit] Ace API success, images:', generatedImageUrls.length);

        // 生成成功后，扣减积分
        await convex.mutation(api.users.deductCredits, {
          userId: user._id,
          amount: 1,
        });

        // 存储生成的图片到 Convex
        const finalImageUrls: string[] = [];
        for (const url of generatedImageUrls) {
          try {
            const result = await convex.action(api.file.storeImageFromUrl, { url });
            finalImageUrls.push(result.url);
          } catch (err) {
            console.error('Store image error:', err);
            finalImageUrls.push(url); // 失败就用原 URL
          }
        }

        // 创建生成历史记录（一步完成）
        await convex.mutation(api.generations.createGeneration, {
          userId: user._id,
          mode: 'image-to-image',
          prompt: prompt.trim(),
          size: size || 'auto',
          referenceImages: imageUrls,
          outputImages: finalImageUrls,
          taskId,
          creditsUsed: 1,
        });

        return NextResponse.json({
          success: true,
          data: {
            taskId,
            imageUrls: finalImageUrls,
          },
        });
      } catch (apiError) {
        // API 失败，不存储任何记录，直接返回错误
        console.error('[Edit] Ace API failed:', apiError);
        return handleError(apiError);
      }
    } finally {
      convex.close();
    }
  } catch (error) {
    return handleError(error);
  }
}
