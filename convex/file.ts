import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * 存储 base64 文件到 Convex Storage
 */
export const storeFile = action({
  args: {
    base64Data: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const base64Content = args.base64Data.includes(',')
      ? args.base64Data.split(',')[1]
      : args.base64Data;

    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: args.mimeType });

    const storageId = await ctx.storage.store(blob);
    const url = await ctx.storage.getUrl(storageId);

    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    return { url, storageId };
  },
});

/**
 * 从 URL 下载图片并存储到 Convex
 */
export const storeImageFromUrl = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(args.url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const blob = await response.blob();
    const storageId = await ctx.storage.store(blob);
    const url = await ctx.storage.getUrl(storageId);

    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    return { url, storageId };
  },
});
