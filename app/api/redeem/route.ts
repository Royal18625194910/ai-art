import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { redeemCode } from '@/lib/coze-client';
import { ConvexClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { getOrCreateUser } from '@/lib/convex-user';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const REDEMPTION_CREDITS = 20; // 兑换成功增加的积分

export async function POST(req: NextRequest) {
  try {
    // 验证用户登录
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 401 },
        { status: 401 }
      );
    }

    if (!convexUrl) {
      return NextResponse.json(
        { success: false, error: 'Convex URL not configured', code: 500 },
        { status: 500 }
      );
    }

    // 获取请求体
    const body = await req.json();
    const { code } = body;

    if (!code?.trim()) {
      return NextResponse.json(
        { success: false, error: '兑换码不能为空', code: 400 },
        { status: 400 }
      );
    }

    const convex = new ConvexClient(convexUrl);

    try {
      // 获取或创建用户
      const user = await getOrCreateUser(clerkId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Failed to get or create user', code: 500 },
          { status: 500 }
        );
      }

      // 调用 Coze 接口验证兑换码
      const redemptionResult = await redeemCode(code.trim());

      if (!redemptionResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: redemptionResult.message,
            code: 400,
          },
          { status: 400 }
        );
      }

      // 兑换成功，增加积分
      const addResult = await convex.mutation(api.users.addCredits, {
        userId: user._id,
        amount: REDEMPTION_CREDITS,
      });

      if (!addResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: addResult.error || '添加积分失败',
            code: 500,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `兑换成功！已添加 ${REDEMPTION_CREDITS} 积分`,
        data: {
          creditsAdded: REDEMPTION_CREDITS,
          totalCredits: addResult.credits,
        },
      });
    } finally {
      convex.close();
    }
  } catch (error) {
    console.error('Redemption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 500,
      },
      { status: 500 }
    );
  }
}
