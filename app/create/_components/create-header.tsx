'use client';

import { motion } from 'framer-motion';
import { Wand2, Coins } from 'lucide-react';
import { useUserCredits } from '@/hooks/use-user-credits';
import { useRouter } from 'next/navigation';

interface CreateHeaderProps {
  title: string;
  subtitle: string;
}

export function CreateHeader({ title, subtitle }: CreateHeaderProps) {
  const { credits, isSignedIn } = useUserCredits();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Wand2 className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        </div>
        {isSignedIn && (
          <div
            onClick={() => router.push('/buy')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-colors"
          >
            <Coins className="w-4 h-4" />
            <span className="text-sm font-medium">{credits} 积分</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </motion.div>
  );
}
