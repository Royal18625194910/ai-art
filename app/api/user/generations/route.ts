import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser, api, getConvexClient } from '@/lib/convex-user';

const convex = getConvexClient();

// 获取用户的生成历史
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const user = await getOrCreateUser(clerkId);

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user', code: 500 }, { status: 500 });
    }

    // 解析分页参数
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const numItems = parseInt(searchParams.get('numItems') || '10', 10);

    const result = await convex.query(api.generations.getGenerationsByUser, {
      userId: user._id,
      paginationOpts: {
        numItems,
        cursor: cursor || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: result.page,
        nextCursor: result.continueCursor,
        isDone: result.isDone,
      },
    });
  } catch (error) {
    console.error('Get generations error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
