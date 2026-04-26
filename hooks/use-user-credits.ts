'use client';

import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/user-store';

/**
 * 获取用户积分
 * 优先从 Convex 获取实时数据，同时更新 Zustand 缓存
 */
export function useUserCredits() {
  const { isSignedIn, isLoaded } = useAuth();

  // 从 Zustand 获取用户 ID 和缓存的积分
  const convexUserId = useUserStore((state) => state.convexUserId);
  const cachedCredits = useUserStore((state) => state.credits);
  const updateCredits = useUserStore((state) => state.updateCredits);

  // 从 Convex 获取实时积分
  const creditsFromConvex = useQuery(
    api.users.getCredits,
    isSignedIn && convexUserId ? { userId: convexUserId as any } : 'skip'
  );

  // 同步 Convex 数据到 Zustand
  useEffect(() => {
    if (creditsFromConvex !== undefined && creditsFromConvex !== cachedCredits) {
      updateCredits(creditsFromConvex);
    }
  }, [creditsFromConvex, cachedCredits, updateCredits]);

  const isLoading = !isLoaded || (isSignedIn && creditsFromConvex === undefined);

  return {
    // 优先使用 Convex 数据，否则使用缓存
    credits: creditsFromConvex ?? cachedCredits ?? 0,
    isLoading,
    isSignedIn,
  };
}
