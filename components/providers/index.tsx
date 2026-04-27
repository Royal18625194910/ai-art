'use client';

import { ReactNode } from 'react';
import { useSyncUserToConvex } from '@/hooks/use-sync-user';
import { ToastProvider } from '@/components/ui/toast';

/**
 * 全局状态管理组件
 * 整合所有需要在应用级别运行的 hooks
 */
function GlobalStateProvider({ children }: { children: ReactNode }) {
  // 登录后自动同步用户到 Convex
  useSyncUserToConvex();

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <GlobalStateProvider>
        {children}
      </GlobalStateProvider>
    </ToastProvider>
  );
}
