'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

/**
 * 登录后自动同步用户到 Convex
 */
export function useSyncUserToConvex() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (hasSynced.current) return;

    const syncUser = async () => {
      try {
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.error('Failed to sync user:', await response.text());
          return;
        }

        const result = await response.json();

        if (result.success) {
          console.log('User synced:', result.data);
          hasSynced.current = true;
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn]);

  return { hasSynced: hasSynced.current };
}
