import { createCreem } from 'creem_io';

// 检查环境变量
const apiKey = process.env.CREEM_API_KEY || '';
const isTestMode = apiKey.startsWith('creem_test_');

// 创建 Creem 客户端
export const creem = createCreem({
  apiKey,
  testMode: isTestMode,
});

export { isTestMode };
