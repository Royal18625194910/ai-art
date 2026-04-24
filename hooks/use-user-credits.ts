'use client';

import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

export function useUserCredits() {
  const { isSignedIn, userId: clerkId } = useAuth();

  // 获取用户数据
  const user = useQuery(
    api.users.getUserByClerkId,
    isSignedIn && clerkId ? { clerkId } : 'skip'
  );

  return {
    credits: user?.credits ?? 0,
    isLoading: user === undefined,
    isSignedIn,
  };
}
