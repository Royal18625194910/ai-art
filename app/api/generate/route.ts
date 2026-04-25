import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser, api, getConvexClient } from '@/lib/convex-user';
import { createAceDataClient, AceDataError } from '@/lib/acedata-sdk';

const convex = getConvexClient();

// 根据环境选择客户端
const USE_MOCK = process.env.USE_MOCK_ACEDATA === 'true' || !process.env.ACEDATA_API_KEY;
const aceClient = createAceDataClient({
  apiKey: process.env.ACEDATA_API_KEY || '',
  timeout: 300000, // 5分钟超时
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

    // 获取或创建 Convex 用户
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

    // 创建 Convex 生成记录
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
      if (USE_MOCK) {
        // Mock 模式：延迟 3 秒后返回示例图片
        await new Promise(resolve => setTimeout(resolve, 3000));
        imageUrls = ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop'];
        taskId = `mock-${Date.now()}`;
      } else {
        // 调用 AceData API
        if (mode === 'text-to-image') {
          const response = await aceClient.createTextToImage({
            prompt: prompt.trim(),
            size: size || '1024x1024',
          });
          taskId = response.task_id;
          imageUrls = response.data.map(item => item.url);
        } else {
          const response = await aceClient.createImageToImage({
            prompt: prompt.trim(),
            image: input_urls[0],
            size: size || '1024x1024',
          });
          taskId = response.task_id;
          imageUrls = response.data.map(item => item.url);
        }
      }

      // 更新 Convex 记录为成功
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: 'success',
        outputImages: imageUrls,
        outputImage: imageUrls[0] || '',
      });

      return NextResponse.json({
        success: true,
        data: { taskId, generationId, imageUrls, mock: USE_MOCK },
      });
    } catch (apiError) {
      // API 失败，标记为失败并退还积分
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: 'failed',
        errorMessage: apiError instanceof Error ? apiError.message : 'API call failed',
      });

      // 退还积分
      await convex.mutation(api.users.addCredits, {
        userId: user._id,
        amount: 1,
      });

      return handleError(apiError);
    }
  } catch (error) {
    return handleError(error);
  }
}
