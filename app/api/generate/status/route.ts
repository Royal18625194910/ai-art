import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const generationId = searchParams.get('generationId') as Id<'generations'> | null;

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required', code: 422 },
        { status: 422 }
      );
    }

    // 从 Convex 获取生成记录
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
  } catch (error) {
    console.error('Get generation status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
