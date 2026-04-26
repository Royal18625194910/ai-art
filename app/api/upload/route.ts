import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// 简单的文件上传处理 - 返回本地 blob URL
export async function POST(req: NextRequest) {
  try {
    // 验证用户登录
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required', code: 422 },
        { status: 422 }
      );
    }

    // 读取文件为 base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: dataUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
