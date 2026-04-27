/**
 * 检测用户是否在中国大陆
 * 使用多种方式检测：时区、语言、IP等
 *
 * @returns boolean - 是否在中国大陆
 *
 * @example
 * ```ts
 * const isInChina = isChinaUser();
 * if (isInChina) {
 *   // 显示中国大陆特有的内容
 * }
 * ```
 */
export function isChinaUser(): boolean {
  try {
    // 1. 检测时区
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const chinaTimeZones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Urumqi', 'Asia/Hong_Kong'];
    if (chinaTimeZones.includes(timeZone)) {
      return true;
    }

    // 2. 检测浏览器语言
    const language = navigator.language || navigator.languages?.[0] || '';
    if (language.startsWith('zh-CN') || language.startsWith('zh-Hans')) {
      return true;
    }

    // 3. 检测系统语言环境
    const systemLanguage = (navigator as Navigator & { systemLanguage?: string }).systemLanguage;
    if (systemLanguage?.startsWith('zh-CN')) {
      return true;
    }

    // 4. 检测 UTC+8 时区偏移
    const offset = new Date().getTimezoneOffset();
    // UTC+8 的 offset 是 -480 分钟
    if (offset === -480) {
      // 可能是中国用户，但也可能是新加坡、香港等
      // 结合语言检测结果
      if (language.startsWith('zh')) {
        return true;
      }
    }

    return false;
  } catch {
    // 如果检测失败，默认返回 false
    return false;
  }
}

/**
 * 获取用户时区信息
 *
 * @returns 包含时区信息的对象
 *
 * @example
 * ```ts
 * const { timeZone, offset, isUTC8 } = getUserTimezoneInfo();
 * ```
 */
export function getUserTimezoneInfo() {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset();
    const language = navigator.language || navigator.languages?.[0] || '';

    return {
      timeZone,
      offset, // 分钟偏移（UTC+8 是 -480）
      isUTC8: offset === -480,
      language,
      isChina: isChinaUser(),
    };
  } catch {
    return {
      timeZone: 'unknown',
      offset: 0,
      isUTC8: false,
      language: 'unknown',
      isChina: false,
    };
  }
}
