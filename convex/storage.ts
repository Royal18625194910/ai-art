import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";

/**
 * 从 URL 下载图片并存储到 Convex Storage
 */
export const storeImageFromUrl = action({
  args: {
    url: v.string(),
    generationId: v.id("generations"),
  },
  handler: async (ctx, args) => {
    try {
      // 下载图片
      const response = await fetch(args.url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }

      const blob = await response.blob();

      // 生成文件名
      const timestamp = Date.now();
      const filename = `generated/${args.generationId}/${timestamp}.png`;

      // 存储到 Convex Storage (需要 Blob)
      const storageId = await ctx.storage.store(blob);

      // 获取存储 URL
      const url = await ctx.storage.getUrl(storageId);
      if (!url) {
        throw new Error("Failed to get storage URL");
      }

      return { success: true, storageId, url };
    } catch (error) {
      console.error("Store image error:", error);
      return { success: false, error: String(error) };
    }
  },
});

/**
 * 批量存储图片并更新生成记录
 */
export const storeImagesAndUpdateGeneration = action({
  args: {
    imageUrls: v.array(v.string()),
    generationId: v.id("generations"),
  },
  handler: async (ctx, args) => {
    const storedUrls: string[] = [];
    const errors: string[] = [];

    for (const url of args.imageUrls) {
      try {
        const result = await ctx.runAction(api.storage.storeImageFromUrl, {
          url,
          generationId: args.generationId,
        });

        if (result.success && result.url) {
          storedUrls.push(result.url);
        } else {
          errors.push(`Failed to store ${url}: ${result.error}`);
        }
      } catch (error) {
        errors.push(`Error storing ${url}: ${String(error)}`);
      }
    }

    // 更新生成记录
    await ctx.runMutation(internal.storage.updateGenerationWithStoredImages, {
      generationId: args.generationId,
      imageUrls: storedUrls,
    });

    return {
      success: storedUrls.length > 0,
      storedUrls,
      errors,
    };
  },
});

/**
 * 更新生成记录为已存储的图片
 */
export const updateGenerationWithStoredImages = internalMutation({
  args: {
    generationId: v.id("generations"),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.imageUrls.length === 0) {
      // 没有存储成功的图片，标记为失败
      await ctx.db.patch(args.generationId, {
        status: "failed",
        errorMessage: "Failed to store generated images",
      });
      return false;
    }

    await ctx.db.patch(args.generationId, {
      status: "success",
      outputImages: args.imageUrls,
      outputImage: args.imageUrls[0],
      completedAt: Date.now(),
    });

    return true;
  },
});
