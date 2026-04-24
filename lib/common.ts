/**
 * 通用工具函数库
 * 业务无关的纯工具函数
 */

/**
 * 格式化价格
 * @param amount 金额
 * @param currency 货币代码，默认 USD
 * @returns 格式化后的价格字符串
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化日期
 * @param timestamp 时间戳或 Date
 * @param locale 语言环境，默认 zh-CN
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  timestamp: number | Date,
  locale = 'zh-CN'
): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化日期时间
 */
export function formatDateTime(
  timestamp: number | Date,
  locale = 'zh-CN'
): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 截断文本
 * @param str 原始字符串
 * @param maxLength 最大长度
 * @param suffix 后缀，默认 ...
 * @returns 截断后的字符串
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 防抖函数
 * @param fn 原函数
 * @param delay 延迟毫秒数
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 * @param fn 原函数
 * @param interval 间隔毫秒数
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

/**
 * 生成唯一 ID
 * @param prefix ID 前缀
 * @returns 唯一 ID 字符串
 */
export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * 下载文件
 * @param url 文件 URL
 * @param filename 下载文件名
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 复制到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * 等待指定时间
 * @param ms 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 将文件转为 base64
 * @param file 文件对象
 * @returns base64 字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 检查文件类型是否为图片
 * @param file 文件对象
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串，如 "1.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 从字符串生成颜色
 * 用于为用户生成头像背景色等
 * @param str 输入字符串
 * @returns 十六进制颜色
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 生成随机字符串
 * @param length 长度
 */
export function randomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 安全解析 JSON
 * @param str JSON 字符串
 * @param defaultValue 解析失败时的默认值
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 计算相对时间（如：2分钟前）
 * @param timestamp 时间戳
 * @param locale 语言
 */
export function timeAgo(timestamp: number, locale = 'zh-CN'): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  const labels: Record<string, Record<string, string>> = {
    'zh-CN': {
      year: '年',
      month: '个月',
      week: '周',
      day: '天',
      hour: '小时',
      minute: '分钟',
      second: '秒',
    },
    en: {
      year: 'year',
      month: 'month',
      week: 'week',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
    },
  };

  const label = labels[locale] || labels['zh-CN'];

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return locale === 'en'
        ? `${interval} ${label[unit]}${interval > 1 ? 's' : ''} ago`
        : `${interval}${label[unit]}前`;
    }
  }

  return locale === 'en' ? 'just now' : '刚刚';
}
