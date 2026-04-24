import { CreditPackage } from '@/types';

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculatePerCreditPrice(price: number, credits: number): string {
  return `$${(price / credits).toFixed(2)}/credit`;
}

export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 3.99,
    priceFormatted: formatPrice(3.99),
    perCreditPrice: calculatePerCreditPrice(3.99, 10),
    description: '适合轻度用户',
    features: [
      '10 张图片生成',
      '高清图片下载',
      '永久有效',
      '标准生成速度',
    ],
    isPopular: false,
    savingsPercent: 0,
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 30,
    price: 9.99,
    priceFormatted: formatPrice(9.99),
    perCreditPrice: calculatePerCreditPrice(9.99, 30),
    description: '最受欢迎的套餐',
    features: [
      '30 张图片生成',
      '高清图片下载',
      '永久有效',
      '优先生成速度',
      '18% 折扣',
    ],
    isPopular: true,
    savingsPercent: 18,
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 75,
    price: 19.99,
    priceFormatted: formatPrice(19.99),
    perCreditPrice: calculatePerCreditPrice(19.99, 75),
    description: '性价比最高',
    features: [
      '75 张图片生成',
      '高清图片下载',
      '永久有效',
      '最快生成速度',
      '33% 折扣',
    ],
    isPopular: false,
    savingsPercent: 33,
  },
];

export const creditRules = {
  perImage: 1,
  description: '1 积分 = 1 张图片',
};

export const contactInfo = {
  supportEmail: '2326182533@qq.com',
};
