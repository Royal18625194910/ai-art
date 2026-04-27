/**
 * AceData Cloud OpenAI Images SDK
 * 支持 GPT-Image-2 的文生图和图生图
 * API 文档: https://api.acedata.cloud
 */

// ==================== 类型定义 ====================

export interface AceDataConfig {
  /** API Key，必需 */
  apiKey: string;
  /** 基础 URL，默认 https://api.acedata.cloud */
  baseURL?: string;
  /** 请求超时时间（毫秒），默认 300000 (5分钟) */
  timeout?: number;
}

/** 支持的模型 */
export type Model = 'gpt-image-2';

/** 图片尺寸 */
export type ImageSize = '1024x1024' | '1024x1536' | '1536x1024' | 'auto';

/** 文生图参数 */
export interface TextToImageParams {
  /** 模型名称，默认 'gpt-image-2' */
  model?: Model;
  /** 提示词，必需 */
  prompt: string;
  /** 图片尺寸，默认 '1024x1024' */
  size?: ImageSize;
  /** 用户标识（可选） */
  user?: string;
}

/** 图生图参数 */
export interface ImageToImageParams {
  /** 模型名称，默认 'gpt-image-2' */
  model?: Model;
  /** 输入图片 URL(s)，可以是单个字符串或数组 */
  image: string | string[];
  /** 提示词，必需 */
  prompt: string;
  /** 图片尺寸，默认 '1024x1024' */
  size?: ImageSize;
  /** 用户标识（可选） */
  user?: string;
}

/** 生成结果项 */
export interface GenerationResult {
  /** 优化后的提示词 */
  revised_prompt: string;
  /** 生成的图片 URL */
  url: string;
}

/** 文生图响应 */
export interface TextToImageResponse {
  /** 是否成功 */
  success: boolean;
  /** 任务 ID */
  task_id: string;
  /** 追踪 ID */
  trace_id?: string;
  /** 创建时间戳 */
  created: number;
  /** 生成结果数组 */
  data: GenerationResult[];
  /** 耗时（秒） */
  elapsed: number;
  /** 开始时间（ISO 格式） */
  started_at?: string;
  /** 完成时间（ISO 格式） */
  finished_at?: string;
}

/** 图生图响应（与文生图相同结构） */
export type ImageToImageResponse = TextToImageResponse;

/** API 错误 */
export class AceDataError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'AceDataError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ==================== SDK 主类 ====================

export class AceDataClient {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(config: AceDataConfig) {
    if (!config.apiKey) {
      throw new Error('AceDataClient: apiKey is required');
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL?.replace(/\/+$/, '') || 'https://api.acedata.cloud';
    this.timeout = config.timeout || 300000; // 5分钟默认超时
  }

  /**
   * 发送 HTTP 请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // 使用 Headers 对象来正确合并 headers
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.apiKey}`);

    // 合并传入的 headers
    if (options.headers) {
      const incomingHeaders = new Headers(options.headers);
      incomingHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    // 自动添加 Content-Type 如果是 POST 且没有设置
    if (options.method === 'POST' && options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      console.log('[AceData SDK] Request:', url, 'headers:', Object.fromEntries(headers.entries()), 'body:', options.body);
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new AceDataError(
          data?.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AceDataError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AceDataError('Request timeout', 408);
        }
        throw new AceDataError(error.message, 500);
      }

      throw new AceDataError('Unknown error occurred', 500);
    }
  }

  /**
   * 文生图
   * @param params 文生图参数
   * @returns 生成结果
   */
  async createTextToImage(params: TextToImageParams): Promise<TextToImageResponse> {
    // 参数验证
    if (!params.prompt?.trim()) {
      throw new AceDataError('prompt is required and cannot be empty', 422);
    }

    const body = {
      model: params.model || 'gpt-image-2',
      prompt: params.prompt.trim(),
      size: params.size || '1024x1024',
      ...(params.user && { user: params.user }),
    };

    return this.request<TextToImageResponse>('/openai/images/generations', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * 图生图
   * @param params 图生图参数
   * @returns 生成结果
   */
  async createImageToImage(params: ImageToImageParams): Promise<ImageToImageResponse> {
    // 参数验证
    if (!params.prompt?.trim()) {
      throw new AceDataError('prompt is required and cannot be empty', 422);
    }

    if (!params.image || (Array.isArray(params.image) && params.image.length === 0)) {
      throw new AceDataError('image URL is required', 422);
    }

    const body = {
      model: params.model || 'gpt-image-2',
      image: params.image,
      prompt: params.prompt.trim(),
      size: params.size || '1024x1024',
      ...(params.user && { user: params.user }),
    };

    console.log('[AceData SDK] createImageToImage body:', JSON.stringify(body));

    return this.request<ImageToImageResponse>('/openai/images/edits', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * 生成图片（带轮询等待完成）
   * 由于 API 是同步的，此方法直接返回结果
   * @param params 文生图参数
   * @returns 图片 URL 数组
   */
  async generateTextToImage(params: TextToImageParams): Promise<string[]> {
    const response = await this.createTextToImage(params);

    if (!response.success || !response.data || response.data.length === 0) {
      throw new AceDataError('No images generated', 500, response);
    }

    return response.data.map(item => item.url);
  }

  /**
   * 图生图（带轮询等待完成）
   * @param params 图生图参数
   * @returns 图片 URL 数组
   */
  async generateImageToImage(params: ImageToImageParams): Promise<string[]> {
    const response = await this.createImageToImage(params);

    if (!response.success || !response.data || response.data.length === 0) {
      throw new AceDataError('No images generated', 500, response);
    }

    return response.data.map(item => item.url);
  }
}

// ==================== 工厂函数 ====================

/**
 * 创建 AceData 客户端实例
 */
export function createAceDataClient(config: AceDataConfig): AceDataClient {
  return new AceDataClient(config);
}

// ==================== 默认导出 ====================

export default AceDataClient;
