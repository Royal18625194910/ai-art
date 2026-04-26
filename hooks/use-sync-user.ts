'use client';

import { useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/user-store';

/**
 * 登录后自动同步用户到 Convex
 * 使用 Zustand 管理用户状态
 * 注意：此 hook 只处理同步逻辑，不返回状态
 * 使用 useUserStore 直接读取状态
 */
export function useSyncUserToConvex() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const syncUserMutation = useMutation(api.users.syncUser);

  // 使用 store 的 getState 避免订阅更新
  const store = useUserStore;
  const hasAttemptedSync = useRef(false);

  // 监听登录状态变化
  useEffect(() => {
    if (!isLoaded) return;

    // 如果已登出，清除用户数据
    if (!isSignedIn) {
      store.getState().clearUser();
      hasAttemptedSync.current = false;
      return;
    }
  }, [isLoaded, isSignedIn, store]);

  // 同步用户到 Convex
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const state = store.getState();
    if (state.isSynced) return; // 已经同步过
    if (hasAttemptedSync.current) return; // 已经尝试同步过

    const syncUser = async () => {
      hasAttemptedSync.current = true;
      state.setLoading(true);

      try {
        // 调用 Convex mutation 同步用户
        const result = await syncUserMutation({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.username || undefined,
          imageUrl: user.imageUrl,
        });

        if (result.userId) {
          // 更新 Zustand store
          state.setUser({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || null,
            name: user.fullName || user.username || null,
            imageUrl: user.imageUrl || null,
            convexUserId: result.userId,
            isSynced: true,
          });

          console.log('User synced to Convex:', result);
        }
      } catch (error) {
        console.error('Failed to sync user to Convex:', error);
        hasAttemptedSync.current = false; // 允许重试
      } finally {
        state.setLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, syncUserMutation, store]);
}
