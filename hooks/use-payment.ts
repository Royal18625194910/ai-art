'use client';

import { useState, useCallback } from 'react';
import type { CreditPackage } from '@/types';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface PaymentState {
  status: PaymentStatus;
  error: string | null;
}

export function usePayment() {
  const [state, setState] = useState<PaymentState>({
    status: 'idle',
    error: null,
  });

  const initiatePayment = useCallback(async (pkg: CreditPackage) => {
    setState({ status: 'processing', error: null });

    try {
      // TODO: Integrate with Creem payment gateway
      // This will redirect to Creem checkout page
      const checkoutUrl = `/api/checkout?package=${pkg.id}&price=${pkg.price}`;

      // For now, simulate the redirect
      window.location.href = checkoutUrl;

      // In real implementation, this would be:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   body: JSON.stringify({ packageId: pkg.id }),
      // });
      // const { url } = await response.json();
      // window.location.href = url;

      setState({ status: 'success', error: null });
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Payment failed',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null });
  }, []);

  return {
    ...state,
    isProcessing: state.status === 'processing',
    initiatePayment,
    reset,
  };
}
