import { Webhook } from '@creem_io/nextjs';
import { ConvexClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onCheckoutCompleted: async ({ product, metadata, id: checkoutId }) => {
    const { packageId, credits, userId } = metadata || {};
    if (!userId || !credits) return;

    const convex = new ConvexClient(convexUrl!);
    try {
      const dbUser = await convex.query(api.users.getUserByClerkId, { clerkId: userId as string || '' });
      if (!dbUser) return;

      // 检查重复支付
      const existing = await convex.query(api.payments.getPaymentByCreemId, { creemPaymentId: checkoutId });
      if (existing) return;

      // 添加积分
      await convex.mutation(api.users.addCredits, {
        userId: dbUser._id,
        amount: parseInt(String(credits), 10),
      });

      // 创建支付记录
      await convex.mutation(api.payments.createPayment, {
        userId: dbUser._id,
        creemPaymentId: checkoutId,
        packageType: packageId as any,
        creditsAmount: parseInt(String(credits), 10),
        amount: product?.price || 0,
        currency: 'USD',
      });
    } finally {
      convex.close();
    }
  },
});
