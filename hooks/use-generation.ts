'use client';

import { useState, useCallback } from 'react';

export type TaskState = 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';

export interface GenerateParams {
  mode: 'text-to-image' | 'image-to-image';
  prompt: string;
  aspect_ratio?: string;
  resolution?: string;
  input_urls?: string[];
}

export interface GenerateResult {
  imageUrls: string[];
  taskId: string;
}

interface UseGenerationOptions {
  onSuccess?: (result: GenerateResult) => void;
  onError?: (error: string) => void;
  onStatusChange?: (state: TaskState) => void;
}

export function useGeneration(options: UseGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [state, setState] = useState<TaskState | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const generate = useCallback(async (params: GenerateParams) => {
    setIsGenerating(true);
    setState('waiting');
    setProgress(10);
    setError(null);
    setResult(null);

    try {
      // 1. 创建任务
      const createResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || 'Failed to create task');
      }

      const { taskId } = createData.data;
      setProgress(20);
      options.onStatusChange?.('waiting');

      // 2. 轮询任务状态
      const maxAttempts = 300;
      const interval = 2000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, interval));

        const statusResponse = await fetch(`/api/generate/status?taskId=${taskId}`);
        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(statusData.error || 'Failed to get task status');
        }

        const task = statusData.data;
        setState(task.state);
        options.onStatusChange?.(task.state);

        // 更新进度
        if (task.state === 'waiting') {
          setProgress(25);
        } else if (task.state === 'queuing') {
          setProgress(30);
        } else if (task.state === 'generating') {
          setProgress(Math.min(30 + attempt, 90));
        } else if (task.state === 'success') {
          setProgress(100);

          // 解析 resultJson
          const resultData = task.resultJson ? JSON.parse(task.resultJson) : null;
          const imageUrls = resultData?.resultUrls || [];

          const result = {
            imageUrls,
            taskId,
          };
          setResult(result);
          options.onSuccess?.(result);
          return result;
        } else if (task.state === 'fail') {
          throw new Error(task.failMsg || 'Generation failed');
        }
      }

      throw new Error('Generation timeout');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setState(null);
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
