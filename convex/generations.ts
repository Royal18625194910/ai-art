import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

/**
 * 生图历史记录操作
 */

// 创建生成记录
export const createGeneration = mutation({
  args: {
    userId: v.id("users"),
    mode: v.union(v.literal("text-to-image"), v.literal("image-to-image")),
    prompt: v.string(),
    taskId: v.optional(v.string()),
    negativePrompt: v.optional(v.string()),
    referenceImages: v.optional(v.array(v.string())),
    outputImages: v.optional(v.array(v.string())),
    aspectRatio: v.optional(v.string()),
    resolution: v.optional(v.string()),
    size: v.optional(v.string()),
    quality: v.optional(v.string()),
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const generationId = await ctx.db.insert("generations", {
      userId: args.userId,
      taskId: args.taskId,
      mode: args.mode,
      prompt: args.prompt,
      negativePrompt: args.negativePrompt,
      referenceImages: args.referenceImages,
      outputImages: args.outputImages || [],
      aspectRatio: args.aspectRatio,
      resolution: args.resolution,
      size: args.size ?? "1:1",
      quality: args.quality ?? "standard",
      creditsUsed: args.creditsUsed,
      status: "pending",
      createdAt: Date.now(),
    });

    return generationId;
  },
});

// 更新生成状态 (用于 webhook 回调)
export const updateGenerationByTaskId = mutation({
  args: {
    taskId: v.string(),
    status: v.union(v.literal("generating"), v.literal("success"), v.literal("failed")),
    outputImages: v.optional(v.array(v.string())),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db
      .query("generations")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .unique();

    if (!generation) {
      throw new Error(`Generation not found for taskId: ${args.taskId}`);
    }

    const update: Record<string, unknown> = {
      status: args.status,
    };

    if (args.outputImages !== undefined) {
      update.outputImages = args.outputImages;
    }

    if (args.errorMessage !== undefined) {
      update.errorMessage = args.errorMessage;
    }

    if (args.status === "success" || args.status === "failed") {
      update.completedAt = Date.now();
    }

    await ctx.db.patch(generation._id, update);
    return generation._id;
  },
});

// 更新生成状态 (通过 generationId)
export const updateGenerationStatus = mutation({
  args: {
    generationId: v.id("generations"),
    status: v.union(v.literal("pending"), v.literal("generating"), v.literal("success"), v.literal("failed")),
    outputImages: v.optional(v.array(v.string())),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const update: Record<string, unknown> = {
      status: args.status,
    };

    if (args.outputImages !== undefined) {
      update.outputImages = args.outputImages;
    }

    if (args.errorMessage !== undefined) {
      update.errorMessage = args.errorMessage;
    }

    if (args.status === "success" || args.status === "failed") {
      update.completedAt = Date.now();
    }

    await ctx.db.patch(args.generationId, update);
    return true;
  },
});

// 获取用户的生成历史 (分页)
export const getGenerationsByUser = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generations")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// 获取单条生成记录
export const getGeneration = query({
  args: { generationId: v.id("generations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.generationId);
  },
});

// 删除生成记录
export const deleteGeneration = mutation({
  args: { generationId: v.id("generations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.generationId);
    return true;
  },
});

// 获取指定用户的生图历史（使用 userId）
export const getUserGenerationsById = query({
  args: {
    userId: v.optional(v.id("users")),
    searchQuery: v.optional(v.string()),
    mode: v.optional(v.union(v.literal("all"), v.literal("text-to-image"), v.literal("image-to-image"))),
    dateRange: v.optional(v.union(
      v.literal("today"),
      v.literal("last7Days"),
      v.literal("last30Days"),
      v.literal("thisMonth"),
      v.literal("allTime")
    )),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      return { items: [], nextCursor: null, total: 0 };
    }

    let generations = await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // 搜索过滤
    if (args.searchQuery) {
      const query = args.searchQuery.toLowerCase();
      generations = generations.filter((g) =>
        g.prompt.toLowerCase().includes(query)
      );
    }

    // 模式过滤
    if (args.mode && args.mode !== "all") {
      generations = generations.filter((g) => g.mode === args.mode);
    }

    // 日期范围过滤
    if (args.dateRange && args.dateRange !== "allTime") {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      generations = generations.filter((g) => {
        const createdAt = g.createdAt;
        const diffDays = (now - createdAt) / oneDay;

        switch (args.dateRange) {
          case "today":
            return diffDays < 1;
          case "last7Days":
            return diffDays < 7;
          case "last30Days":
            return diffDays < 30;
          case "thisMonth": {
            const nowDate = new Date(now);
            const genDate = new Date(createdAt);
            return (
              nowDate.getMonth() === genDate.getMonth() &&
              nowDate.getFullYear() === genDate.getFullYear()
            );
          }
          default:
            return true;
        }
      });
    }

    // 分页
    const limit = args.limit ?? 12;
    let startIndex = 0;
    if (args.cursor) {
      startIndex = parseInt(args.cursor);
    }
    const endIndex = startIndex + limit;
    const paginatedItems = generations.slice(startIndex, endIndex);
    const nextCursor = endIndex < generations.length ? String(endIndex) : null;

    return {
      items: paginatedItems.map((g) => ({
        id: g._id,
        imageUrl: g.outputImages?.[0] || "",
        prompt: g.prompt,
        mode: g.mode,
        size: g.size || g.resolution || "1K",
        quality: g.quality || "standard",
        aspectRatio: g.aspectRatio || "1:1",
        creditsUsed: g.creditsUsed,
        status: g.status,
        createdAt: g.createdAt,
        outputImages: g.outputImages || []
      })),
      nextCursor,
      total: generations.length,
    };
  },
});

// 获取指定用户的生图统计
export const getUserGenerationStatsById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      return { total: 0, textToImage: 0, imageToImage: 0, creditsUsed: 0 };
    }

    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    return {
      total: generations.length,
      textToImage: generations.filter((g) => g.mode === "text-to-image").length,
      imageToImage: generations.filter((g) => g.mode === "image-to-image").length,
      creditsUsed: generations.reduce((sum, g) => sum + g.creditsUsed, 0),
    };
  },
});

// 获取当前用户的生图历史（带认证）
export const getMyGenerations = query({
  args: {
    searchQuery: v.optional(v.string()),
    mode: v.optional(v.union(v.literal("all"), v.literal("text-to-image"), v.literal("image-to-image"))),
    dateRange: v.optional(v.union(
      v.literal("today"),
      v.literal("last7Days"),
      v.literal("last30Days"),
      v.literal("thisMonth"),
      v.literal("allTime")
    )),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return { items: [], nextCursor: null, total: 0 };
    }

    const clerkId = user.subject;
    const dbUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!dbUser) {
      return { items: [], nextCursor: null, total: 0 };
    }

    let generations = await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", dbUser._id))
      .order("desc")
      .collect();

    // 搜索过滤
    if (args.searchQuery) {
      const query = args.searchQuery.toLowerCase();
      generations = generations.filter((g) =>
        g.prompt.toLowerCase().includes(query)
      );
    }

    // 模式过滤
    if (args.mode && args.mode !== "all") {
      generations = generations.filter((g) => g.mode === args.mode);
    }

    // 日期范围过滤
    if (args.dateRange && args.dateRange !== "allTime") {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      generations = generations.filter((g) => {
        const createdAt = g.createdAt;
        const diffDays = (now - createdAt) / oneDay;

        switch (args.dateRange) {
          case "today":
            return diffDays < 1;
          case "last7Days":
            return diffDays < 7;
          case "last30Days":
            return diffDays < 30;
          case "thisMonth": {
            const nowDate = new Date(now);
            const genDate = new Date(createdAt);
            return (
              nowDate.getMonth() === genDate.getMonth() &&
              nowDate.getFullYear() === genDate.getFullYear()
            );
          }
          default:
            return true;
        }
      });
    }

    // 分页
    const limit = args.limit ?? 12;
    let startIndex = 0;
    if (args.cursor) {
      startIndex = parseInt(args.cursor);
    }
    const endIndex = startIndex + limit;
    const paginatedItems = generations.slice(startIndex, endIndex);
    const nextCursor = endIndex < generations.length ? String(endIndex) : null;

    return {
      items: paginatedItems.map((g) => ({
        id: g._id,
        imageUrl: g.outputImages?.[0] || "",
        prompt: g.prompt,
        mode: g.mode,
        size: g.size || g.resolution || "1K",
        quality: g.quality || "standard",
        aspectRatio: g.aspectRatio || "1:1",
        creditsUsed: g.creditsUsed,
        status: g.status,
        createdAt: g.createdAt,
        outputImages: g.outputImages || []
      })),
      nextCursor,
      total: generations.length,
    };
  },
});

// 获取当前用户的生图统计
export const getMyGenerationStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return { total: 0, textToImage: 0, imageToImage: 0, creditsUsed: 0 };
    }

    const clerkId = user.subject;
    const dbUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!dbUser) {
      return { total: 0, textToImage: 0, imageToImage: 0, creditsUsed: 0 };
    }

    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", dbUser._id))
      .collect();

    return {
      total: generations.length,
      textToImage: generations.filter((g) => g.mode === "text-to-image").length,
      imageToImage: generations.filter((g) => g.mode === "image-to-image").length,
      creditsUsed: generations.reduce((sum, g) => sum + g.creditsUsed, 0),
    };
  },
});

// 清除所有测试数据
export const clearMockGenerations = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const clerkId = user.subject;
    const dbUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!dbUser) {
      return { deleted: 0 };
    }

    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", dbUser._id))
      .collect();

    for (const gen of generations) {
      await ctx.db.delete(gen._id);
    }

    return { deleted: generations.length };
  },
});

// 获取所有用户列表
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
