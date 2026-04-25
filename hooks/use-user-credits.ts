'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function useUserCredits() {
  const { isSignedIn, isLoaded } = useAuth();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/user/credits');
        if (response.ok) {
          const result = await response.json();
          setCredits(result.data?.credits ?? 0);
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [isLoaded, isSignedIn]);

  return {
    credits,
    isLoading,
    isSignedIn,
  };
}
