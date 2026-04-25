import { NextRequest, NextResponse } from 'next/server';
import { auth, getAuth } from '@clerk/nextjs/server';
import { getOrCreateUser } from '@/lib/convex-user';

// 登录后同步用户到 Convex
export async function POST(req: NextRequest) {
  try {
    // 尝试多种方式获取 auth
    const authResult = await auth();
    const authFromHeaders = getAuth(req);

    console.log('Sync API - Auth result:', authResult);
    console.log('Sync API - Auth from headers:', authFromHeaders);

    const userId = authResult.userId || authFromHeaders.userId;

    if (!userId) {
      console.log('Sync API - No userId found');
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    console.log('Syncing user to Convex:', userId);

    const user = await getOrCreateUser(userId);

    if (!user) {
      console.error('Failed to create user in Convex');
      return NextResponse.json({ error: 'Failed to sync user', code: 500 }, { status: 500 });
    }

    console.log('User synced successfully:', user._id);

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Sync user error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', code: 500, details: message },
      { status: 500 }
    );
  }
}
