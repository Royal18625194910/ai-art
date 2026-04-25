'use client';

import { Clock, Zap, Star, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreditInfoItemProps {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  delay?: number;
}

function CreditInfoItem({ icon, title, description, delay = 0 }: CreditInfoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + delay }}
      className="bg-card/30 rounded-xl p-6 border border-border/50"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface CreditInfoTranslations {
  neverExpires: string;
  neverExpiresDesc: string;
  priority: string;
  priorityDesc: string;
  usage: string;
  support: string;
  supportDesc: string;
}

interface CreditInfoProps {
  features: string[];
  creditInfo: CreditInfoTranslations;
}

export function CreditInfo({ features, creditInfo }: CreditInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <CreditInfoItem
        icon={<Clock className="w-5 h-5 text-purple-400" />}
        title={creditInfo.neverExpires}
        description={creditInfo.neverExpiresDesc}
        delay={0}
      />
      <CreditInfoItem
        icon={<Zap className="w-5 h-5 text-purple-400" />}
        title={creditInfo.priority}
        description={creditInfo.priorityDesc}
        delay={0.1}
      />
      <CreditInfoItem
        icon={<Star className="w-5 h-5 text-purple-400" />}
        title={creditInfo.usage}
        description={
          <ul className="mt-2 space-y-1">
            {features.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                {item}
              </li>
            ))}
          </ul>
        }
        delay={0.2}
      />
      <CreditInfoItem
        icon={<HelpCircle className="w-5 h-5 text-purple-400" />}
        title={creditInfo.support}
        description={creditInfo.supportDesc}
        delay={0.3}
      />
    </div>
  );
}
