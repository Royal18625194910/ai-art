import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

/**
 * 付费记录操作 (Creem 支付)
 */

// 创建付费记录
export const createPayment = mutation({
  args: {
    userId: v.id("users"),
    creemPaymentId: v.string(),
    packageType: v.union(v.literal("starter"), v.literal("standard"), v.literal("premium")),
    creditsAmount: v.number(),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      userId: args.userId,
      creemPaymentId: args.creemPaymentId,
      packageType: args.packageType,
      creditsAmount: args.creditsAmount,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
      createdAt: Date.now(),
    });

    return paymentId;
  },
});

// 通过 Creem Payment ID 查找记录
export const getPaymentByCreemId = query({
  args: { creemPaymentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_creem_payment_id", (q) => q.eq("creemPaymentId", args.creemPaymentId))
      .unique();
  },
});

// 更新付费状态
export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const update: Record<string, unknown> = {
      status: args.status,
    };

    if (args.paidAt !== undefined) {
      update.paidAt = args.paidAt;
    }

    await ctx.db.patch(args.paymentId, update);
    return true;
  },
});

// 获取用户的付费历史
export const getPaymentsByUser = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
