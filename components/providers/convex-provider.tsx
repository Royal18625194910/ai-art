'use client';

import { ReactNode, useCallback } from 'react';
import { ConvexReactClient, ConvexProviderWithAuth } from 'convex/react';
import { useAuth } from '@clerk/nextjs';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(convexUrl);

function useConvexAuth() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const fetchAccessToken = useCallback(async () => {
    return getToken({ template: 'convex' }) ?? null;
  }, [getToken]);

  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    fetchAccessToken,
  };
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
