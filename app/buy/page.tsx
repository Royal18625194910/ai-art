'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Sparkles, 
  Check, 
  ChevronDown,
  Crown,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Clock,
  Lock,
  HelpCircle,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTranslation, useCommonTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

type PackageType = 'starter' | 'standard' | 'premium';
type PaymentMethod = 'stripe' | 'paypal';

interface FAQItem {
  question: string;
  answer: string;
}

export default function BuyPage() {
  const { t, tObject, tArray } = usePageTranslation('buy');
  const { t: tCommon, credits } = useCommonTranslation();
  const [mounted, setMounted] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('standard');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = `${t('title')} | ${siteConfig.name}`;
  }, [t]);

  const packages = [
    {
      type: 'starter' as PackageType,
      name: t('packages.starter.name'),
      credits: parseInt(t('packages.starter.credits')),
      price: t('packages.starter.price'),
      priceCN: t('packages.starter.priceCN'),
      description: t('packages.starter.description'),
      perCreditPrice: t('packages.starter.perCreditPrice'),
      features: [
        t('packages.starter.features.0'),
        t('packages.starter.features.1'),
        t('packages.starter.features.2'),
        t('packages.starter.features.3'),
      ],
      isPopular: false,
      savingsPercent: 0,
    },
    {
      type: 'standard' as PackageType,
      name: t('packages.standard.name'),
      credits: parseInt(t('packages.standard.credits')),
      price: t('packages.standard.price'),
      priceCN: t('packages.standard.priceCN'),
      description: t('packages.standard.description'),
      perCreditPrice: t('packages.standard.perCreditPrice'),
      features: [
        t('packages.standard.features.0'),
        t('packages.standard.features.1'),
        t('packages.standard.features.2'),
        t('packages.standard.features.3'),
        t('packages.standard.features.4'),
      ],
      isPopular: true,
      savingsPercent: parseInt(t('packages.standard.savingsPercent') || '18'),
    },
    {
      type: 'premium' as PackageType,
      name: t('packages.premium.name'),
      credits: parseInt(t('packages.premium.credits')),
      price: t('packages.premium.price'),
      priceCN: t('packages.premium.priceCN'),
      description: t('packages.premium.description'),
      perCreditPrice: t('packages.premium.perCreditPrice'),
      features: [
        t('packages.premium.features.0'),
        t('packages.premium.features.1'),
        t('packages.premium.features.2'),
        t('packages.premium.features.3'),
        t('packages.premium.features.4'),
        t('packages.premium.features.5'),
      ],
      isPopular: false,
      savingsPercent: parseInt(t('packages.premium.savingsPercent') || '33'),
    },
  ];

  const paymentMethods = [
    { type: 'stripe' as PaymentMethod, name: 'Stripe', icon: CreditCard },
    { type: 'paypal' as PaymentMethod, name: 'PayPal', icon: CreditCard },
  ];

  const faqItems: FAQItem[] = [
    {
      question: t('faq.items.0.question'),
      answer: t('faq.items.0.answer'),
    },
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer'),
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer'),
    },
    {
      question: t('faq.items.3.question'),
      answer: t('faq.items.3.answer'),
    },
    {
      question: t('faq.items.4.question'),
      answer: t('faq.items.4.answer'),
    },
    {
      question: t('faq.items.5.question'),
      answer: t('faq.items.5.answer'),
    },
  ];

  const currentCredits = 10;
  const selectedPackageData = packages.find((p) => p.type === selectedPackage)!;

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(t('payment.success'));
    }, 2000);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/3 via-cyan-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-24 pb-16">
        <Container className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">{t('packages.bestValue')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>

            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-card/50 backdrop-blur-xl border border-border/50">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">{t('currentBalance.label')}</p>
                <p className="text-lg font-semibold text-foreground">
                  {currentCredits} <span className="text-muted-foreground font-normal">{t('currentBalance.credits')}</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedPackage(pkg.type)}
                className={cn(
                  'relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300',
                  selectedPackage === pkg.type
                    ? 'border-purple-500 bg-card/80 shadow-xl shadow-purple-500/10'
                    : 'border-border/50 bg-card/30 hover:border-border/80 hover:bg-card/50'
                )}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 px-4 py-1"
                    >
                      <Crown className="w-3.5 h-3.5 mr-1" />
                      {t('packages.recommended')}
                    </Badge>
                  </div>
                )}

                {pkg.savingsPercent > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      <Zap className="w-3.5 h-3.5 mr-1" />
                      {t('packages.savings', { percent: pkg.savingsPercent })}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.perCreditPrice}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={cn(
                  'w-full py-3 rounded-xl text-center font-medium transition-all',
                  selectedPackage === pkg.type
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-muted/50 text-muted-foreground'
                )}>
                  {selectedPackage === pkg.type ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      {t('payment.selected')}
                    </span>
                  ) : (
                    tCommon('nav.buy')
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  {t('payment.title')}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.type}
                      onClick={() => setSelectedPayment(method.type)}
                      className={cn(
                        'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all',
                        selectedPayment === method.type
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border/50 hover:border-border/80'
                      )}
                    >
                      <method.icon className={cn(
                        'w-5 h-5',
                        selectedPayment === method.type ? 'text-purple-400' : 'text-muted-foreground'
                      )} />
                      <span className={cn(
                        'font-medium',
                        selectedPayment === method.type ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-background/50 rounded-xl p-6 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-4">{t('payment.orderSummary.title')}</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('payment.orderSummary.package')}</span>
                    <span className="text-sm font-medium text-foreground">{selectedPackageData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('payment.orderSummary.credits')}</span>
                    <span className="text-sm font-medium text-foreground">{selectedPackageData.credits} {t('currentBalance.credits')}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-foreground">{t('payment.orderSummary.total')}</span>
                      <span className="text-xl font-bold text-gradient-purple">{selectedPackageData.price}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('payment.processing')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t('payment.cta.stripe')}
                    </span>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  {tCommon('common.securePayment')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className="bg-card/30 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('creditsInfo.validity')}</h4>
                  <p className="text-sm text-muted-foreground">{t('creditsInfo.validityDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/30 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('creditsInfo.priority')}</h4>
                  <p className="text-sm text-muted-foreground">{t('creditsInfo.priorityDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/30 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('creditsInfo.whatCanDo')}</h4>
                  <ul className="mt-2 space-y-1">
                    {tArray('creditsInfo.whatCanDoList').map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/30 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t('creditsInfo.refund')}</h4>
                  <p className="text-sm text-muted-foreground">{t('creditsInfo.refundDesc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t('faq.title')}
            </h2>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-card/30 rounded-xl border border-border/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-4">{item.question}</span>
                    <div className={cn(
                      'w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center transition-transform flex-shrink-0',
                      expandedFAQ === index && 'rotate-180'
                    )}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
