'use client';

import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/user-store';

/**
 * 获取当前登录用户的完整信息
 * 包括 Zustand 中的缓存数据和 Convex 中的实时积分
 */
export function useCurrentUser() {
  // 使用单个 selector 避免创建多个订阅
  const { user, isSynced, isLoading } = useUserStore((state) => ({
    user: {
      clerkId: state.clerkId,
      email: state.email,
      name: state.name,
      imageUrl: state.imageUrl,
      convexUserId: state.convexUserId,
    },
    isSynced: state.isSynced,
    isLoading: state.isLoading,
  }));

  // 从 Convex 获取实时积分（如果有 convexUserId）
  const creditsFromConvex = useQuery(
    api.users.getCredits,
    user.convexUserId ? { userId: user.convexUserId as any } : 'skip'
  );

  return {
    ...user,
    credits: creditsFromConvex ?? 0,
    isSynced,
    isLoading,
    // 是否已完全加载
    isReady: isSynced && user.convexUserId !== null,
  };
}

/**
 * 获取用户积分（单独 Hook，用于只需要积分的场景）
 * 自动更新 Zustand 缓存
 */
export function useUserCredits() {
  const convexUserId = useUserStore((state) => state.convexUserId);
  const cachedCredits = useUserStore((state) => state.credits);
  const updateCredits = useUserStore((state) => state.updateCredits);

  const creditsFromConvex = useQuery(
    api.users.getCredits,
    convexUserId ? { userId: convexUserId as any } : 'skip'
  );

  // 如果 Convex 返回了新的积分值，更新 Zustand
  useEffect(() => {
    if (creditsFromConvex !== undefined && creditsFromConvex !== cachedCredits) {
      updateCredits(creditsFromConvex);
    }
  }, [creditsFromConvex, cachedCredits, updateCredits]);

  return {
    credits: creditsFromConvex ?? cachedCredits ?? 0,
    convexUserId,
  };
}
