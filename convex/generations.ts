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
    negativePrompt: v.optional(v.string()),
    referenceImages: v.optional(v.array(v.string())),
    size: v.string(),
    quality: v.string(),
    creditsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const generationId = await ctx.db.insert("generations", {
      userId: args.userId,
      mode: args.mode,
      prompt: args.prompt,
      negativePrompt: args.negativePrompt,
      referenceImages: args.referenceImages,
      outputImage: "", // 生成完成后更新
      size: args.size,
      quality: args.quality,
      creditsUsed: args.creditsUsed,
      status: "pending",
      createdAt: Date.now(),
    });

    return generationId;
  },
});

// 更新生成状态 (成功或失败)
export const updateGenerationStatus = mutation({
  args: {
    generationId: v.id("generations"),
    status: v.union(v.literal("success"), v.literal("failed")),
    outputImage: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const update: Record<string, unknown> = {
      status: args.status,
    };

    if (args.outputImage !== undefined) {
      update.outputImage = args.outputImage;
    }

    if (args.errorMessage !== undefined) {
      update.errorMessage = args.errorMessage;
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
