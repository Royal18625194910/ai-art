'use client';

import { useState, useCallback } from 'react';

export type GenerationState = 'idle' | 'generating' | 'success' | 'failed';

export interface GenerateParams {
  mode: 'text-to-image' | 'image-to-image';
  prompt: string;
  size?: string;
  input_urls?: string[];
}

export interface GenerateResult {
  imageUrls: string[];
  taskId: string;
  generationId: string;
}

interface UseGenerationOptions {
  onSuccess?: (result: GenerateResult) => void;
  onError?: (error: string) => void;
}

export function useGeneration(options: UseGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [state, setState] = useState<GenerationState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const generate = useCallback(async (params: GenerateParams) => {
    setIsGenerating(true);
    setState('generating');
    setProgress(10);
    setError(null);
    setResult(null);

    try {
      // 调用 API（同步等待，最长5分钟）
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setProgress(100);
      setState('success');

      const result: GenerateResult = {
        imageUrls: data.data.imageUrls,
        taskId: data.data.taskId,
        generationId: data.data.generationId,
      };

      setResult(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setState('failed');
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setState('idle');
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return {
    generate,
    isGenerating,
    state,
    progress,
    error,
    result,
    reset,
  };
}
