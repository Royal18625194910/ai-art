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
        imageUrl: g.outputImages?.[0] || g.outputImage || "",
        prompt: g.prompt,
        mode: g.mode,
        size: g.size || g.resolution || "1K",
        quality: g.quality || "standard",
        aspectRatio: g.aspectRatio || "1:1",
        creditsUsed: g.creditsUsed,
        status: g.status,
        createdAt: g.createdAt,
        outputImages: g.outputImages || (g.outputImage ? [g.outputImage] : []),
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
        imageUrl: g.outputImages?.[0] || g.outputImage || "",
        prompt: g.prompt,
        mode: g.mode,
        size: g.size || g.resolution || "1K",
        quality: g.quality || "standard",
        aspectRatio: g.aspectRatio || "1:1",
        creditsUsed: g.creditsUsed,
        status: g.status,
        createdAt: g.createdAt,
        outputImages: g.outputImages || (g.outputImage ? [g.outputImage] : []),
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

// Admin seed function - 从 Convex Dashboard 运行
// 为指定用户创建大量测试数据
export const seedGenerationsForUser = mutation({
  args: {
    userId: v.id("users"),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count ?? 50;
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error(`User not found: ${args.userId}`);
    }

    // 更丰富的测试数据
    const textToImagePrompts = [
      "A serene Japanese zen garden with cherry blossoms falling",
      "Cyberpunk neon city street at rainy night",
      "Cute corgi puppy wearing a bowtie, professional photo",
      "Abstract fluid art with purple and gold swirls",
      "Medieval castle on a cliff overlooking stormy seas",
      "Minimalist modern living room with floor-to-ceiling windows",
      "Astronaut floating in space with Earth reflection in helmet",
      "Vintage vinyl record player with warm lighting",
      "Tropical beach paradise with crystal clear turquoise water",
      "Steampunk mechanical butterfly with intricate gears",
      "Watercolor painting of lavender fields in Provence",
      "Dark fantasy forest with bioluminescent plants",
      "Art deco style portrait of a flapper girl",
      "Futuristic flying car in a sleek metropolis",
      "Cozy cottage interior with fireplace and books",
      "Majestic lion portrait with dramatic lighting",
      "Colorful hot air balloons over Cappadocia at sunrise",
      "Retro 80s synthwave landscape with grid floor",
      "Delicate origami crane made of cherry blossom petals",
      "Underwater coral reef with tropical fish",
    ];

    const imageToImagePrompts = [
      "Transform into Van Gogh style oil painting",
      "Convert to black and white noir film aesthetic",
      "Apply anime manga art style",
      "Transform into watercolor illustration",
      "Make it look like a 1980s polaroid photo",
      "Apply impressionist painting style",
      "Convert to pixel art game style",
      "Transform into Art Nouveau poster",
      "Apply cyberpunk neon filter",
      "Make it look like a Renaissance painting",
      "Convert to paper cutout art style",
      "Apply Studio Ghibli animation style",
      "Transform into low poly 3D render",
      "Make it look like a 1950s magazine ad",
      "Apply surrealist dreamlike quality",
    ];

    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "2:3"];
    const qualities = ["standard", "high", "ultra"];
    const resolutions = ["1K", "2K", "4K"];
    const statuses = ["success", "success", "success", "success", "failed"] as const; // 80% success rate

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const createdIds = [];

    for (let i = 0; i < count; i++) {
      const isTextToImage = Math.random() > 0.3; // 70% text-to-image
      const mode = isTextToImage ? "text-to-image" : "image-to-image";
      const prompts = isTextToImage ? textToImagePrompts : imageToImagePrompts;
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];

      // Random date within last 60 days
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = now - (daysAgo * oneDay) - Math.floor(Math.random() * oneDay);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const aspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      const quality = qualities[Math.floor(Math.random() * qualities.length)];
      const creditsUsed = resolution === "4K" ? 2 : 1;

      // Generate image URL based on mode and random seed
      const imageSeed = i + Math.floor(Math.random() * 1000);
      const outputImage = status === "success"
        ? `https://picsum.photos/seed/${imageSeed}/400/400`
        : "";

      const generationId = await ctx.db.insert("generations", {
        userId: args.userId,
        mode,
        prompt,
        negativePrompt: Math.random() > 0.7 ? "blurry, low quality, distorted" : undefined,
        size: resolution,
        resolution,
        quality,
        aspectRatio,
        creditsUsed,
        status,
        outputImage,
        outputImages: status === "success" ? [outputImage] : [],
        referenceImages: mode === "image-to-image"
          ? [`https://picsum.photos/seed/ref${imageSeed}/400/400`]
          : undefined,
        createdAt,
        completedAt: status === "success" ? createdAt + Math.floor(Math.random() * 60000) : undefined,
        errorMessage: status === "failed" ? "Generation timeout or server error" : undefined,
      });

      createdIds.push(generationId);
    }

    return {
      success: true,
      created: createdIds.length,
      userId: args.userId,
      userName: user.name || user.email,
    };
  },
});

// 获取所有用户列表（用于选择seed目标）
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
