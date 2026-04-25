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
      outputImage: "",
      outputImages: [],
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
    outputImage: v.optional(v.string()),
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
      // 兼容旧字段
      update.outputImage = args.outputImages[0] ?? "";
    }

    if (args.outputImage !== undefined) {
      update.outputImage = args.outputImage;
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
    outputImage: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const update: Record<string, unknown> = {
      status: args.status,
    };

    if (args.outputImages !== undefined) {
      update.outputImages = args.outputImages;
      update.outputImage = args.outputImages[0] ?? "";
    }

    if (args.outputImage !== undefined) {
      update.outputImage = args.outputImage;
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
