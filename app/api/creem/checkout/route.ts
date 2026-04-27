import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { creem } from '@/lib/creem';

/**
 * 创建 Creem Checkout 会话
 * POST /api/creem/checkout
 * Body: { productId: string, successUrl?: string, metadata?: object, customerEmail?: string }
 */
export async function POST(req: NextRequest) {
  try {
    // 验证用户登录
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { productId, successUrl, metadata, customerEmail } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('[Creem Checkout] Creating checkout:', { productId, userId, customerEmail });

    // 创建 checkout 会话
    const checkout = await creem.checkouts.create({
      productId,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/buy?status=completed`,
      metadata: {
        ...metadata,
        userId,
      },
      // 如果提供了邮箱，预填充客户信息
      ...(customerEmail ? {
        customer: {
          email: customerEmail,
        },
      } : {}),
    });

    console.log('[Creem Checkout] Created:', checkout.id, 'URL:', checkout.checkoutUrl);

    return NextResponse.json({
      success: true,
      checkout_url: checkout.checkoutUrl,
      checkoutId: checkout.id,
    });
  } catch (error: any) {
    console.error('[Creem Checkout] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to create checkout',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/creem/checkout
 * 测试配置
 */
export async function GET() {
  const apiKey = process.env.CREEM_API_KEY || '';
  const isTestMode = apiKey.startsWith('creem_test_');

  return NextResponse.json({
    success: true,
    message: 'Creem checkout endpoint ready',
    configured: !!apiKey,
    testMode: isTestMode,
  });
}
