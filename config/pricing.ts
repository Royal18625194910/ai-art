import { CreditPackage } from '@/types';

export type Locale = 'zh' | 'en' | 'zh-TW';

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculatePerCreditPrice(price: number, credits: number): string {
  return `$${(price / credits).toFixed(2)}/credit`;
}

// 多语言配置
export const pricingI18n = {
  zh: {
    packages: {
      starter: {
        name: 'Starter',
        description: '试试水',
        features: ['20 张图片生成', '高清图片下载', '永久有效', '标准生成速度'],
      },
      standard: {
        name: 'Standard',
        description: '最划算',
        features: ['60 张图片生成', '高清图片下载', '永久有效', '优先生成速度'],
      },
      premium: {
        name: 'Premium',
        description: '重度首选',
        features: ['200 张图片生成', '高清图片下载', '永久有效', '最快生成速度'],
      },
    },
    popularLabel: '最受欢迎',
    ctaButton: '立即购买',
    creditLabel: '积分',
    creditRulesDescription: '1 积分 = 1 张图片',
  },
  en: {
    packages: {
      starter: {
        name: 'Starter',
        description: 'Try it out',
        features: ['20 image generations', 'HD download', 'Never expires', 'Standard speed'],
      },
      standard: {
        name: 'Standard',
        description: 'Best value',
        features: ['60 image generations', 'HD download', 'Never expires', 'Priority speed'],
      },
      premium: {
        name: 'Premium',
        description: 'For power users',
        features: ['200 image generations', 'HD download', 'Never expires', 'Fastest speed'],
      },
    },
    popularLabel: 'Most Popular',
    ctaButton: 'Buy Now',
    creditLabel: 'credits',
    creditRulesDescription: '1 credit = 1 image',
  },
  'zh-TW': {
    packages: {
      starter: {
        name: 'Starter',
        description: '試試水',
        features: ['20 張圖片生成', '高清圖片下載', '永久有效', '標準生成速度'],
      },
      standard: {
        name: 'Standard',
        description: '最划算',
        features: ['60 張圖片生成', '高清圖片下載', '永久有效', '優先生成速度'],
      },
      premium: {
        name: 'Premium',
        description: '重度首選',
        features: ['200 張圖片生成', '高清圖片下載', '永久有效', '最快生成速度'],
      },
    },
    popularLabel: '最受歡迎',
    ctaButton: '立即購買',
    creditLabel: '積分',
    creditRulesDescription: '1 積分 = 1 張圖片',
  },
};

// 套餐基础数据（包含 Creem 产品 ID）
export const basePackages = [
  {
    id: 'starter',
    creemProductId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER || '',
    credits: 20,
    price: 6.99,
    isPopular: false,
    savingsPercent: 0,
  },
  {
    id: 'standard',
    creemProductId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_STANDARD || '',
    credits: 60,
    price: 12.99,
    isPopular: true,
    savingsPercent: 35,
  },
  {
    id: 'premium',
    creemProductId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PREMIUM || '',
    credits: 200,
    price: 39.99,
    isPopular: false,
    savingsPercent: 46,
  },
] as const;

// 套餐 ID 类型
export type PackageId = typeof basePackages[number]['id'];

// 有效的套餐 ID 列表
const validPackageIds: PackageId[] = ['starter', 'standard', 'premium'];

// 验证套餐 ID 是否有效
export function isValidPackageId(id: string): id is PackageId {
  return validPackageIds.includes(id as PackageId);
}

// 获取指定语言的套餐配置
export function getCreditPackages(locale: Locale = 'zh'): CreditPackage[] {
  const i18n = pricingI18n[locale] || pricingI18n.zh;

  return basePackages.map((pkg) => {
    const packageI18n = i18n.packages[pkg.id as keyof typeof i18n.packages];
    return {
      ...pkg,
      name: packageI18n.name,
      priceFormatted: formatPrice(pkg.price),
      perCreditPrice: calculatePerCreditPrice(pkg.price, pkg.credits),
      description: packageI18n.description,
      features: packageI18n.features,
    };
  });
}

// 根据套餐 ID 获取 Creem 产品 ID
export function getCreemProductId(packageId: PackageId): string {
  const pkg = basePackages.find((p) => p.id === packageId);
  return pkg?.creemProductId || '';
}

// 根据套餐 ID 获取积分数量
export function getPackageCredits(packageId: PackageId): number {
  const pkg = basePackages.find((p) => p.id === packageId);
  return pkg?.credits || 0;
}

// 获取指定语言的文案
export function getPricingLabels(locale: Locale = 'zh') {
  const i18n = pricingI18n[locale] || pricingI18n.zh;
  return {
    popularLabel: i18n.popularLabel,
    ctaButton: i18n.ctaButton,
    creditLabel: i18n.creditLabel,
    creditRulesDescription: i18n.creditRulesDescription,
  };
}

// 默认导出（中文）
export const creditPackages: CreditPackage[] = getCreditPackages('zh');

export const creditRules = {
  perImage: 1,
  description: '1 积分 = 1 张图片',
};

export const contactInfo = {
  supportEmail: '2326182533@qq.com',
};
