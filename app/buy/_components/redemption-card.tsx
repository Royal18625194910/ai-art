'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { xianyuConfig } from '@/config/site';

interface RedemptionCardProps {
  t: (key: string) => string;
}

export function RedemptionCard({ t }: RedemptionCardProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleRedeem = useCallback(async () => {
    if (!code.trim()) {
      setResult({ type: 'error', message: '请输入兑换码' });
      return;
    }

    setIsLoading(true);
    setResult({ type: null, message: '' });

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          type: 'success',
          message: data.message || '兑换成功！已添加 20 积分',
        });
        setCode(''); // 清空输入框
      } else {
        setResult({
          type: 'error',
          message: data.error || '兑换失败，请检查兑换码是否正确',
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: '网络错误，请稍后重试',
      });
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-xl">
          <Gift className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">闲鱼特惠兑换</h3>
          <p className="text-sm text-muted-foreground">中国大陆用户专享优惠</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {xianyuConfig.description}
      </p>

      <a
        href={xianyuConfig.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors mb-6"
      >
        <span>前往闲鱼购买兑换码</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            输入兑换码
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="例如: BUBBLE-XXXX-XXXX"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50 uppercase"
          />
        </div>

        <Button
          variant="primary"
          onClick={handleRedeem}
          disabled={isLoading || !code.trim()}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              正在兑换...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              立即兑换（+20 积分）
            </span>
          )}
        </Button>

        <AnimatePresence mode="wait">
          {result.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                result.type === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {result.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{result.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
