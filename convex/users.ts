import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * 用户相关操作，包含积分管理
 */

// 通过 Clerk ID 获取用户
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// 创建用户 (Clerk webhook 调用)
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      credits: 3, // 新用户送 3 积分
      createdAt: Date.now(),
    });

    return userId;
  },
});

// 更新用户信息
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return null;

    await ctx.db.patch(user._id, {
      name: args.name ?? user.name,
      imageUrl: args.imageUrl ?? user.imageUrl,
    });

    return user._id;
  },
});

// 获取用户积分
export const getCredits = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.credits ?? 0;
  },
});

// 充值积分 (购买成功回调)
export const addCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return { success: false, error: "User not found" };

    const newCredits = user.credits + args.amount;
    await ctx.db.patch(args.userId, { credits: newCredits });

    return { success: true, credits: newCredits };
  },
});

// 同步用户（客户端直接调用）
// 检查用户是否存在，不存在则创建
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      // 更新用户信息（如果有变化）
      const updates: Partial<typeof existing> = {};
      if (args.name && args.name !== existing.name) updates.name = args.name;
      if (args.imageUrl && args.imageUrl !== existing.imageUrl) updates.imageUrl = args.imageUrl;
      if (args.email && args.email !== existing.email) updates.email = args.email;

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existing._id, updates);
      }

      return { userId: existing._id, isNew: false };
    }

    // 创建新用户
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      credits: 3, // 新用户送 3 积分
      createdAt: Date.now(),
    });

    return { userId, isNew: true };
  },
});
export const deductCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return { success: false, error: "User not found" };

    if (user.credits < args.amount) {
      return { success: false, error: "Insufficient credits", credits: user.credits };
    }

    const newCredits = user.credits - args.amount;
    await ctx.db.patch(args.userId, { credits: newCredits });

    return { success: true, credits: newCredits };
  },
});
