/**
 * 下载图片工具函数
 * 使用 fetch + blob 方式实现跨域图片下载
 *
 * @param url - 图片 URL
 * @param filename - 下载文件名（可选，默认自动生成）
 * @returns Promise<void>
 *
 * @example
 * ```ts
 * await downloadImage('https://example.com/image.png', 'my-art.png');
 * ```
 */
export async function downloadImage(url: string, filename?: string): Promise<void> {
  try {
    // 获取图片数据
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 生成默认文件名
    const defaultFilename = `ai-art-${Date.now()}.png`;
    const finalFilename = filename || defaultFilename;

    // 创建下载链接
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 清理 blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);

    // 降级方案：尝试直接打开链接
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    throw error;
  }
}

/**
 * 批量下载图片
 *
 * @param urls - 图片 URL 数组
 * @param baseFilename - 基础文件名（会自动添加序号）
 *
 * @example
 * ```ts
 * await downloadImages(['url1.png', 'url2.png'], 'my-art');
 * // 下载文件: my-art-1.png, my-art-2.png
 * ```
 */
export async function downloadImages(urls: string[], baseFilename: string = 'ai-art'): Promise<void> {
  for (let i = 0; i < urls.length; i++) {
    const filename = `${baseFilename}-${i + 1}.png`;
    await downloadImage(urls[i], filename);

    // 添加小延迟避免浏览器阻塞
    if (i < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
