import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { redeemCode } from '@/lib/coze-client';
import { api } from '@/convex/_generated/api';
import { getOrCreateUser, getConvexClient } from '@/lib/convex-user';

const REDEMPTION_CREDITS = 20;

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 401 },
        { status: 401 }
      );
    }

    const { code } = await req.json();
    if (!code?.trim()) {
      return NextResponse.json(
        { success: false, error: '兑换码不能为空', code: 400 },
        { status: 400 }
      );
    }

    const redemptionResult = await redeemCode(code.trim());
    if (!redemptionResult.success) {
      return NextResponse.json(
        { success: false, error: redemptionResult.message, code: 400 },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(clerkId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在', code: 500 },
        { status: 500 }
      );
    }

    const convex = getConvexClient();
    const addResult = await convex.mutation(api.users.addCredits, {
      userId: user._id,
      amount: REDEMPTION_CREDITS,
    });

    return NextResponse.json({
      success: true,
      message: `兑换成功！已添加 ${REDEMPTION_CREDITS} 积分`,
      data: {
        creditsAdded: REDEMPTION_CREDITS,
        totalCredits: addResult.credits,
      },
    });
  } catch (error) {
    console.error('Redemption error:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误', code: 500 },
      { status: 500 }
    );
  }
}
