/**
 * KIE AI SDK
 * 封装 KIE AI 的文生图、图生图和文件上传接口
 * API 文档: https://docs.kie.ai
 */

// ==================== 类型定义 ====================

export interface KIEConfig {
  /** API Key，必需 */
  apiKey: string;
  /** 基础 URL，默认 https://api.kie.ai */
  baseURL?: string;
  /** 请求超时时间（毫秒），默认 60000 */
  timeout?: number;
  /** Webhook URL，用于接收任务完成通知 */
  webhookUrl?: string;
}

/** 图片比例 */
export type AspectRatio = 'auto' | '1:1' | '9:16' | '16:9' | '4:3' | '3:4';

/** 图片分辨率 */
export type Resolution = '1K' | '2K' | '4K';

/** 模型名称 */
export type ModelName = 'gpt-image-2-text-to-image' | 'gpt-image-2-image-to-image';

/** 文生图参数 */
export interface TextToImageParams {
  /** 提示词，最多 20000 字符，必需 */
  prompt: string;
  /** 宽高比，默认 'auto' */
  aspect_ratio?: AspectRatio;
  /** 分辨率，默认 '1K'。注意：1:1 比例不能生成 4K */
  resolution?: Resolution;
}

/** 图生图参数 */
export interface ImageToImageParams {
  /** 提示词，最多 20000 字符，必需 */
  prompt: string;
  /** 输入图片 URL 数组，最多 16 张，必需 */
  input_urls: string[];
  /** 宽高比，默认 'auto' */
  aspect_ratio?: AspectRatio;
  /** 分辨率，默认 '1K' */
  resolution?: Resolution;
}

/** 创建任务请求 */
export interface CreateTaskRequest {
  model: ModelName;
  input: TextToImageParams | ImageToImageParams;
  callBackUrl?: string;
}

/** 创建任务响应 */
export interface CreateTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

/** 任务状态 */
export type TaskStatus = 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';

/** 任务详情 */
export interface TaskDetail {
  taskId: string;
  model: string;
  state: TaskStatus;
  param: string; // JSON string
  resultJson?: string; // JSON string containing resultUrls
  failCode?: string;
  failMsg?: string;
  costTime?: number;
  completeTime?: number;
  createTime: number;
  updateTime: number;
  progress?: number; // 0-100, only for sora2
}

/** 查询任务响应 */
export interface GetTaskResponse {
  code: number;
  msg: string;
  data: TaskDetail;
}

/** 流式上传参数 */
export interface StreamUploadParams {
  /** 文件对象，必需 */
  file: File | Blob;
  /** 上传路径，如 'images/user-uploads'，必需 */
  uploadPath: string;
  /** 文件名（可选），包含扩展名 */
  fileName?: string;
}

/** URL 上传参数 */
export interface UrlUploadParams {
  /** 文件 URL，必需 */
  fileUrl: string;
  /** 上传路径，如 'images/downloaded'，必需 */
  uploadPath: string;
  /** 文件名（可选），包含扩展名 */
  fileName?: string;
}

/** Base64 上传参数 */
export interface Base64UploadParams {
  /** Base64 编码数据，支持纯字符串或 Data URL 格式，必需 */
  base64Data: string;
  /** 上传路径，如 'images/base64'，必需 */
  uploadPath: string;
  /** 文件名（可选），包含扩展名 */
  fileName?: string;
}

/** 文件上传结果 */
export interface FileUploadResult {
  fileName: string;
  filePath: string;
  downloadUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/** 上传响应 */
export interface UploadResponse {
  success: boolean;
  code: number;
  msg: string;
  data?: FileUploadResult;
}

/** API 错误码 */
export enum APIErrorCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  INSUFFICIENT_CREDITS = 402,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  RATE_LIMITED = 429,
  SUB_KEY_LIMIT = 433,
  SERVICE_UNAVAILABLE = 455,
  SERVER_ERROR = 500,
  GENERATION_FAILED = 501,
  FEATURE_DISABLED = 505,
}

/** SDK 错误 */
export class KIEAIError extends Error {
  code: APIErrorCode;
  details?: any;

  constructor(code: APIErrorCode, message: string, details?: any) {
    super(message);
    this.name = 'KIEAIError';
    this.code = code;
    this.details = details;
  }
}

// ==================== SDK 主类 ====================

export class KIEAIClient {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private webhookUrl?: string;

  constructor(config: KIEConfig) {
    if (!config.apiKey) {
      throw new Error('KIEAIClient: apiKey is required');
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL?.replace(/\/+$/, '') || 'https://api.kie.ai';
    this.timeout = config.timeout || 60000;
    this.webhookUrl = config.webhookUrl;
  }

  // ==================== 私有方法 ====================

  /**
   * 设置请求头
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client-Name': 'kie-ai-sdk',
      'X-Client-Version': '1.0.0',
    };
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

    // 对于 GET 请求，不添加 Content-Type
    const isGetRequest = !options.method || options.method === 'GET';
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client-Name': 'kie-ai-sdk',
      'X-Client-Version': '1.0.0',
      ...options.headers,
    };

    if (!isGetRequest) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new KIEAIError(
          data?.code || response.status,
          data?.msg || `HTTP ${response.status}: ${response.statusText}`,
          data
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof KIEAIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new KIEAIError(APIErrorCode.SERVER_ERROR, 'Request timeout');
        }
        // Provide better error message for connection issues
        if (error.message.includes('fetch failed') || error.message.includes('ECONNRESET')) {
          throw new KIEAIError(
            APIErrorCode.SERVER_ERROR,
            'Failed to connect to KIE AI API. Please check your network connection or if the API is accessible in your region.'
          );
        }
        throw new KIEAIError(APIErrorCode.SERVER_ERROR, error.message);
      }

      throw new KIEAIError(APIErrorCode.SERVER_ERROR, 'Unknown error occurred');
    }
  }

  /**
   * 构建创建任务请求
   */
  private buildCreateTaskRequest(
    model: ModelName,
    input: TextToImageParams | ImageToImageParams,
    callBackUrl?: string
  ): CreateTaskRequest {
    return {
      model,
      input,
      callBackUrl: callBackUrl || this.webhookUrl,
    };
  }

  // ==================== 图片生成 API ====================

  /**
   * 创建文生图任务
   * @param params 文生图参数
   * @param callBackUrl 可选的回调 URL
   * @returns 任务 ID
   */
  async createTextToImageTask(
    params: TextToImageParams,
    callBackUrl?: string
  ): Promise<string> {
    // 参数验证
    if (!params.prompt?.trim()) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'prompt is required and cannot be empty'
      );
    }

    if (params.prompt.length > 20000) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'prompt must be less than 20000 characters'
      );
    }

    const request = this.buildCreateTaskRequest(
      'gpt-image-2-text-to-image',
      params,
      callBackUrl
    );

    const response = await this.request<CreateTaskResponse>(
      '/api/v1/jobs/createTask',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (response.code !== APIErrorCode.SUCCESS) {
      throw new KIEAIError(response.code, response.msg, response.data);
    }

    return response.data.taskId;
  }

  /**
   * 创建图生图任务
   * @param params 图生图参数
   * @param callBackUrl 可选的回调 URL
   * @returns 任务 ID
   */
  async createImageToImageTask(
    params: ImageToImageParams,
    callBackUrl?: string
  ): Promise<string> {
    // 参数验证
    if (!params.prompt?.trim()) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'prompt is required and cannot be empty'
      );
    }

    if (!params.input_urls || params.input_urls.length === 0) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'input_urls is required and cannot be empty'
      );
    }

    if (params.input_urls.length > 16) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'input_urls must not exceed 16 items'
      );
    }

    const request = this.buildCreateTaskRequest(
      'gpt-image-2-image-to-image',
      params,
      callBackUrl
    );

    const response = await this.request<CreateTaskResponse>(
      '/api/v1/jobs/createTask',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (response.code !== APIErrorCode.SUCCESS) {
      throw new KIEAIError(response.code, response.msg, response.data);
    }

    return response.data.taskId;
  }

  /**
   * 查询任务详情
   * @param taskId 任务 ID
   * @returns 任务详情
   */
  async getTaskDetail(taskId: string): Promise<TaskDetail> {
    if (!taskId) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'taskId is required'
      );
    }

    const response = await this.request<GetTaskResponse>(
      `/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`
    );

    if (response.code !== APIErrorCode.SUCCESS) {
      throw new KIEAIError(response.code, response.msg, response.data);
    }

    return response.data;
  }

  /**
   * 轮询等待任务完成
   * @param taskId 任务 ID
   * @param options 轮询选项
   * @returns 任务详情
   */
  async waitForTask(
    taskId: string,
    options: {
      interval?: number;      // 轮询间隔（毫秒），默认 2000
      maxAttempts?: number;   // 最大轮询次数，默认 60
      onProgress?: (state: TaskStatus, progress?: number) => void;  // 进度回调
    } = {}
  ): Promise<TaskDetail> {
    const { interval = 2000, maxAttempts = 300, onProgress } = options;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const task = await this.getTaskDetail(taskId);

      if (onProgress) {
        onProgress(task.state, task.progress);
      }

      if (task.state === 'success') {
        return task;
      }

      if (task.state === 'fail') {
        throw new KIEAIError(
          APIErrorCode.GENERATION_FAILED,
          task.failMsg || 'Task failed',
          task
        );
      }

      // waiting, queuing, generating - 继续等待
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new KIEAIError(
      APIErrorCode.SERVER_ERROR,
      `Task timeout after ${maxAttempts} attempts`
    );
  }

  /**
   * 文生图完整流程（创建任务 + 等待完成）
   * @param params 文生图参数
   * @param options 轮询选项
   * @returns 生成的图片 URL 数组
   */
  async generateTextToImage(
    params: TextToImageParams,
    options?: {
      interval?: number;
      maxAttempts?: number;
      onProgress?: (state: TaskStatus, progress?: number) => void;
    }
  ): Promise<string[]> {
    const taskId = await this.createTextToImageTask(params);
    const task = await this.waitForTask(taskId, options);

    // 解析 resultJson
    const resultData = task.resultJson ? JSON.parse(task.resultJson) : null;
    const imageUrls = resultData?.resultUrls || [];

    if (imageUrls.length === 0) {
      throw new KIEAIError(
        APIErrorCode.GENERATION_FAILED,
        'No images generated',
        task
      );
    }

    return imageUrls;
  }

  /**
   * 图生图完整流程（创建任务 + 等待完成）
   * @param params 图生图参数
   * @param options 轮询选项
   * @returns 生成的图片 URL 数组
   */
  async generateImageToImage(
    params: ImageToImageParams,
    options?: {
      interval?: number;
      maxAttempts?: number;
      onProgress?: (state: TaskStatus, progress?: number) => void;
    }
  ): Promise<string[]> {
    const taskId = await this.createImageToImageTask(params);
    const task = await this.waitForTask(taskId, options);

    // 解析 resultJson
    const resultData = task.resultJson ? JSON.parse(task.resultJson) : null;
    const imageUrls = resultData?.resultUrls || [];

    if (imageUrls.length === 0) {
      throw new KIEAIError(
        APIErrorCode.GENERATION_FAILED,
        'No images generated',
        task
      );
    }

    return imageUrls;
  }

  // ==================== 文件上传 API ====================

  /**
   * 流式文件上传
   * @param params 上传参数
   * @returns 上传结果
   */
  async uploadFileStream(params: StreamUploadParams): Promise<FileUploadResult> {
    if (!params.file) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'file is required'
      );
    }

    if (!params.uploadPath) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'uploadPath is required'
      );
    }

    const formData = new FormData();
    formData.append('file', params.file, params.fileName || 'file');
    formData.append('uploadPath', params.uploadPath);
    if (params.fileName) {
      formData.append('fileName', params.fileName);
    }

    const response = await fetch(`${this.baseURL}/api/file-stream-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Client-Name': 'kie-ai-sdk',
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      throw new KIEAIError(
        data?.code || response.status,
        data?.msg || `Upload failed: ${response.statusText}`,
        data
      );
    }

    return data.data;
  }

  /**
   * URL 文件上传
   * @param params 上传参数
   * @returns 上传结果
   */
  async uploadFileFromUrl(params: UrlUploadParams): Promise<FileUploadResult> {
    if (!params.fileUrl) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'fileUrl is required'
      );
    }

    if (!params.uploadPath) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'uploadPath is required'
      );
    }

    const response = await this.request<UploadResponse>('/api/file-url-upload', {
      method: 'POST',
      body: JSON.stringify({
        fileUrl: params.fileUrl,
        uploadPath: params.uploadPath,
        fileName: params.fileName,
      }),
    });

    if (!response.success) {
      throw new KIEAIError(response.code, response.msg, response.data);
    }

    return response.data!;
  }

  /**
   * Base64 文件上传
   * @param params 上传参数
   * @returns 上传结果
   */
  async uploadFileBase64(params: Base64UploadParams): Promise<FileUploadResult> {
    if (!params.base64Data) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'base64Data is required'
      );
    }

    if (!params.uploadPath) {
      throw new KIEAIError(
        APIErrorCode.VALIDATION_ERROR,
        'uploadPath is required'
      );
    }

    const response = await this.request<UploadResponse>('/api/file-base64-upload', {
      method: 'POST',
      body: JSON.stringify({
        base64Data: params.base64Data,
        uploadPath: params.uploadPath,
        fileName: params.fileName,
      }),
    });

    if (!response.success) {
      throw new KIEAIError(response.code, response.msg, response.data);
    }

    return response.data!;
  }

  /**
   * 便捷方法：上传文件（自动选择最佳方式）
   * - File/Blob 对象：使用流式上传
   * - URL 字符串：使用 URL 上传
   * - Base64 字符串：使用 Base64 上传
   */
  async upload(
    source: File | Blob | string,
    options: {
      uploadPath: string;
      fileName?: string;
      isUrl?: boolean;
      isBase64?: boolean;
    }
  ): Promise<FileUploadResult> {
    if (source instanceof File || source instanceof Blob) {
      return this.uploadFileStream({
        file: source,
        uploadPath: options.uploadPath,
        fileName: options.fileName,
      });
    }

    if (options.isBase64 || source.startsWith('data:') || /^[A-Za-z0-9+/=]+$/.test(source)) {
      return this.uploadFileBase64({
        base64Data: source,
        uploadPath: options.uploadPath,
        fileName: options.fileName,
      });
    }

    // 默认按 URL 处理
    return this.uploadFileFromUrl({
      fileUrl: source,
      uploadPath: options.uploadPath,
      fileName: options.fileName,
    });
  }
}

// ==================== 工厂函数 ====================

/**
 * 创建 KIE AI 客户端实例
 */
export function createKIEAIClient(config: KIEConfig): KIEAIClient {
  return new KIEAIClient(config);
}

// ==================== 默认导出 ====================

export default KIEAIClient;
