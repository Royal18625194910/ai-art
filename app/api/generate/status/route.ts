import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { createKIEAIClient, KIEAIError, APIErrorCode } from '@/lib/kie-ai-sdk';
import { MockKIEClient } from '@/lib/mock-kie-client';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const USE_MOCK = process.env.USE_MOCK_KIE === 'true' || !process.env.KIE_API_KEY;
const kieClient = USE_MOCK
  ? new MockKIEClient()
  : createKIEAIClient({ apiKey: process.env.KIE_API_KEY! });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const generationId = searchParams.get('generationId') as Id<'generations'> | null;

    if (!taskId && !generationId) {
      return NextResponse.json(
        { error: 'Task ID or Generation ID is required', code: 422 },
        { status: 422 }
      );
    }

    // 如果只有 generationId，从 Convex 获取
    if (generationId && !taskId) {
      const generation = await convex.query(api.generations.getGeneration, { generationId });
      if (!generation) {
        return NextResponse.json({ error: 'Generation not found', code: 404 }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          generationId: generation._id,
          status: generation.status,
          outputImages: generation.outputImages,
          outputImage: generation.outputImage,
          errorMessage: generation.errorMessage,
          createdAt: generation.createdAt,
          completedAt: generation.completedAt,
        },
      });
    }

    // 查询任务状态
    const task = await kieClient.getTaskDetail(taskId!);

    // 更新 Convex 记录
    if (generationId) {
      if (task.state === 'success') {
        const resultData = task.resultJson ? JSON.parse(task.resultJson) : null;
        const imageUrls = resultData?.resultUrls || [];

        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status: 'success',
          outputImages: imageUrls,
          outputImage: imageUrls[0] || '',
        });
      } else if (task.state === 'fail') {
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status: 'failed',
          errorMessage: task.failMsg || 'Generation failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        taskId,
        state: task.state,
        progress: task.progress,
        outputImages: task.resultJson ? JSON.parse(task.resultJson)?.resultUrls : undefined,
        errorMessage: task.failMsg,
      },
    });
  } catch (error) {
    console.error('Get task status error:', error);

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
}
