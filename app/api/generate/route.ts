import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { createKIEAIClient, KIEAIError, APIErrorCode } from '@/lib/kie-ai-sdk';
import { MockKIEClient } from '@/lib/mock-kie-client';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// 根据环境选择客户端
const USE_MOCK = process.env.USE_MOCK_KIE === 'true' || !process.env.KIE_API_KEY;
const kieClient = USE_MOCK
  ? new MockKIEClient()
  : createKIEAIClient({ apiKey: process.env.KIE_API_KEY! });

function handleError(error: unknown): NextResponse {
  console.error('Generate error:', error);

  if (error instanceof KIEAIError) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: error.code === APIErrorCode.UNAUTHORIZED ? 401 : 500 }
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

    // 获取 Convex 用户
    const user = await convex.query(api.users.getUserByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 404 }, { status: 404 });
    }

    // 检查积分
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits', code: 402, credits: user.credits },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { mode, prompt, aspect_ratio, resolution, input_urls } = body;

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
      aspectRatio: aspect_ratio || '1:1',
      resolution: resolution || '1K',
      referenceImages: input_urls,
      creditsUsed: 1,
    });

    // 创建 KIE AI 任务 (或 Mock)
    let taskId: string | null = null;
    try {
      taskId = mode === 'text-to-image'
        ? await kieClient.createTextToImageTask({
            prompt: prompt.trim(),
            aspect_ratio: aspect_ratio || '1:1',
            resolution: resolution || '1K',
          })
        : await kieClient.createImageToImageTask({
            prompt: prompt.trim(),
            input_urls,
            aspect_ratio: aspect_ratio || '1:1',
            resolution: resolution || '1K',
          });

      // 更新记录，添加 taskId
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: 'generating',
      });

      // 如果是 Mock 模式，关联 taskId 和 generationId
      if (USE_MOCK && kieClient instanceof MockKIEClient) {
        kieClient.setGenerationId(taskId, generationId);
      }

      // 如果是 Mock 模式，返回提示
      if (USE_MOCK) {
        return NextResponse.json({
          success: true,
          data: { taskId, generationId, mock: true },
          message: 'Running in mock mode - images will be simulated',
        });
      }
    } catch (kieError) {
      // KIE API 失败，标记为失败并退还积分
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: 'failed',
        errorMessage: kieError instanceof Error ? kieError.message : 'API connection failed',
      });

      // 退还积分
      await convex.mutation(api.users.addCredits, {
        userId: user._id,
        amount: 1,
      });

      return handleError(kieError);
    }

    return NextResponse.json({
      success: true,
      data: { taskId, generationId },
    });
  } catch (error) {
    return handleError(error);
  }
}
