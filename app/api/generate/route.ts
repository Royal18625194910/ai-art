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
  console.error('Generate error:', error);

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
      const { mode, prompt, size, input_urls } = body;

      if (!prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required', code: 422 }, { status: 422 });
      }

      if (mode === 'image-to-image' && (!input_urls || input_urls.length === 0)) {
        return NextResponse.json(
          { error: 'Input images are required for image-to-image mode', code: 422 },
          { status: 422 }
        );
      }

      // 扣减积分
      const deductResult = await convex.mutation(api.users.deductCredits, {
        userId: user._id,
        amount: 1,
      });

      if (!deductResult.success) {
        return NextResponse.json(
          { error: deductResult.error, code: 402, credits: deductResult.credits },
          { status: 402 }
        );
      }

      // 创建生成记录
      const generationId = await convex.mutation(api.generations.createGeneration, {
        userId: user._id,
        mode,
        prompt: prompt.trim(),
        size: size || '1024x1024',
        referenceImages: input_urls,
        creditsUsed: 1,
      });

      let imageUrls: string[] = [];
      let taskId: string = '';

      try {
        // 调用 Ace API 生成图片
        if (mode === 'text-to-image') {
          const response = await aceClient.createTextToImage({
            model: 'gpt-image-2',
            prompt: prompt.trim(),
            size: size || '1024x1024',
          });
          taskId = response.task_id;
          imageUrls = response.data.map(item => item.url);
        } else {
          const response = await aceClient.createImageToImage({
            model: 'gpt-image-2',
            prompt: prompt.trim(),
            image: input_urls[0],
            size: size || '1024x1024',
          });
          taskId = response.task_id;
          imageUrls = response.data.map(item => item.url);
        }

        console.log('[Generate] Ace API success, images:', imageUrls.length);

        // 使用 Convex action 存储图片
        const storageResult = await convex.action(api.storage.storeImagesAndUpdateGeneration, {
          imageUrls,
          generationId,
        });

        let finalImageUrls = imageUrls;
        if (storageResult.success && storageResult.storedUrls.length > 0) {
          finalImageUrls = storageResult.storedUrls;
        }

        return NextResponse.json({
          success: true,
          data: {
            taskId,
            generationId,
            imageUrls: finalImageUrls,
          },
        });
      } catch (apiError) {
        // API 失败，标记为失败并退还积分
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status: 'failed',
          errorMessage: apiError instanceof Error ? apiError.message : 'API call failed',
        });

        await convex.mutation(api.users.addCredits, {
          userId: user._id,
          amount: 1,
        });

        return handleError(apiError);
      }
    } finally {
      convex.close();
    }
  } catch (error) {
    return handleError(error);
  }
}
