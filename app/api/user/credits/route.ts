import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser, api, getConvexClient } from '@/lib/convex-user';
import { Id } from '@/convex/_generated/dataModel';

const convex = getConvexClient();

// 获取用户积分
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

    return NextResponse.json({
      success: true,
      data: {
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}

// 充值积分
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const user = await getOrCreateUser(clerkId);

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user', code: 500 }, { status: 500 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount', code: 422 },
        { status: 422 }
      );
    }

    const result = await convex.mutation(api.users.addCredits, {
      userId: user._id as Id<'users'>,
      amount,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        credits: result.credits,
      },
    });
  } catch (error) {
    console.error('Add credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
