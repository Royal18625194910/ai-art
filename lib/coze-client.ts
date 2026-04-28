const COZE_API_KEY = process.env.COZE_API_KEY || '';
const COZE_WORKFLOW_ID = '7578420683400413211';
const COZE_API_URL = 'https://api.coze.cn/v1/workflow/run';

export interface CozeRedemptionResponse {
  success: boolean;
  message: string;
  debugUrl?: string;
  error?: string;
}

/**
 * 调用 Coze 兑换码验证接口
 *
 * @param code - 兑换码
 * @returns 兑换结果
 *
 * @example
 * ```ts
 * const result = await redeemCode('BUBBLE-MIPNS6RA-YSJ3MFNPK6L');
 * if (result.success) {
 *   console.log('兑换成功:', result.message);
 * }
 * ```
 */
export async function redeemCode(code: string): Promise<CozeRedemptionResponse> {
  if (!COZE_API_KEY) {
    return {
      success: false,
      message: 'Coze API Key 未配置',
      error: 'Missing COZE_API_KEY',
    };
  }

  try {
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: COZE_WORKFLOW_ID,
        parameters: {
          input: code.trim(),
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('Coze API error:', response.status, text);
      return {
        success: false,
        message: `Coze 接口请求失败 (${response.status})`,
        error: `HTTP ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = await response.json();

    // 解析 data 字段（它是一个 JSON 字符串）
    let parsedData: { output?: string; success?: boolean } = {};
    try {
      if (typeof data.data === 'string') {
        parsedData = JSON.parse(data.data);
      } else if (data.data) {
        parsedData = data.data;
      }
    } catch {
      return {
        success: false,
        message: '解析响应数据失败',
        error: 'Parse error',
      };
    }

    // 根据 success 字段判断兑换结果
    if (parsedData.success === true) {
      return {
        success: true,
        message: parsedData.output || '兑换成功',
        debugUrl: data.debug_url,
      };
    } else {
      return {
        success: false,
        message: parsedData.output || '兑换码无效或已使用',
        debugUrl: data.debug_url,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '请求异常',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
