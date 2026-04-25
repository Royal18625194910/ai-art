import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Mock 任务存储 (内存中)
const mockTasks = new Map<string, {
  state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';
  progress: number;
  resultUrls?: string[];
  createdAt: number;
  generationId?: string;
}>();

// 清理过期任务 (1小时后)
setInterval(() => {
  const now = Date.now();
  for (const [taskId, task] of mockTasks.entries()) {
    if (now - task.createdAt > 3600000) {
      mockTasks.delete(taskId);
    }
  }
}, 60000);

export class MockKIEClient {
  async createTextToImageTask(params: {
    prompt: string;
    aspect_ratio?: string;
    resolution?: string;
  }): Promise<string> {
    const taskId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    mockTasks.set(taskId, {
      state: 'waiting',
      progress: 0,
      createdAt: Date.now(),
    });

    // 模拟任务进度
    this.simulateTaskProgress(taskId);

    return taskId;
  }

  async createImageToImageTask(params: {
    prompt: string;
    input_urls: string[];
    aspect_ratio?: string;
    resolution?: string;
  }): Promise<string> {
    return this.createTextToImageTask(params);
  }

  async getTaskDetail(taskId: string): Promise<any> {
    const task = mockTasks.get(taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    return {
      taskId,
      state: task.state,
      progress: task.progress,
      resultJson: task.resultUrls ? JSON.stringify({ resultUrls: task.resultUrls }) : undefined,
    };
  }

  // 设置关联的 generationId
  setGenerationId(taskId: string, generationId: string) {
    const task = mockTasks.get(taskId);
    if (task) {
      task.generationId = generationId;
    }
  }

  private simulateTaskProgress(taskId: string) {
    const steps = [
      { state: 'queuing' as const, delay: 1000 },
      { state: 'generating' as const, delay: 2000, progress: 25 },
      { state: 'generating' as const, delay: 4000, progress: 50 },
      { state: 'generating' as const, delay: 6000, progress: 75 },
      { state: 'success' as const, delay: 8000, progress: 100 },
    ];

    steps.forEach(({ state, delay, progress }) => {
      setTimeout(() => {
        const task = mockTasks.get(taskId);
        if (task) {
          task.state = state;
          if (progress !== undefined) {
            task.progress = progress;
          }

          if (state === 'success') {
            // 返回示例图片
            task.resultUrls = [
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
            ];

            // 更新 Convex 记录
            if (task.generationId) {
              this.updateConvexGeneration(task.generationId, task.resultUrls);
            }
          }
        }
      }, delay);
    });
  }

  private async updateConvexGeneration(generationId: string, imageUrls: string[]) {
    try {
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId: generationId as Id<'generations'>,
        status: 'success',
        outputImages: imageUrls,
        outputImage: imageUrls[0] || '',
      });
    } catch (error) {
      console.error('Failed to update Convex generation:', error);
    }
  }
}

// Mock 上传
export async function mockUploadFile(file: File): Promise<{
  downloadUrl: string;
  fileName: string;
}> {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 返回本地 blob URL
  const url = URL.createObjectURL(file);

  return {
    downloadUrl: url,
    fileName: file.name,
  };
}
