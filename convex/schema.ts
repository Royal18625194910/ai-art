import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema - AI Art MVP
 * 最小化设计，只保留核心字段
 */
export default defineSchema({
  // 用户表 - 同步 Clerk 用户数据，包含积分余额
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    credits: v.number(), // 剩余积分
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // 生图历史记录
  generations: defineTable({
    userId: v.id("users"),
    mode: v.union(v.literal("text-to-image"), v.literal("image-to-image")),
    prompt: v.string(),
    negativePrompt: v.optional(v.string()),
    referenceImages: v.optional(v.array(v.string())),
    outputImage: v.string(),
    size: v.string(),
    quality: v.string(),
    creditsUsed: v.number(),
    status: v.union(v.literal("pending"), v.literal("success"), v.literal("failed")),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  // 付费记录
  payments: defineTable({
    userId: v.id("users"),
    creemPaymentId: v.string(), // Creem 支付 ID
    packageType: v.union(v.literal("starter"), v.literal("standard"), v.literal("premium")),
    creditsAmount: v.number(), // 购买的积分数
    amount: v.number(), // 支付金额 (USD)
    currency: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_creem_payment_id", ["creemPaymentId"]),
});
