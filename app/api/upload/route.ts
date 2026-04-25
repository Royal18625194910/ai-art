import { NextRequest, NextResponse } from 'next/server';
import { createKIEAIClient, KIEAIError, APIErrorCode } from '@/lib/kie-ai-sdk';
import { mockUploadFile } from '@/lib/mock-kie-client';

const USE_MOCK = process.env.USE_MOCK_KIE === 'true' || !process.env.KIE_API_KEY;
const kieClient = USE_MOCK
  ? null
  : createKIEAIClient({ apiKey: process.env.KIE_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required', code: 422 },
        { status: 422 }
      );
    }

    let result;

    if (USE_MOCK) {
      result = await mockUploadFile(file);
    } else {
      result = await kieClient!.uploadFileStream({
        file,
        uploadPath: 'images/user-uploads',
        fileName: file.name,
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      mock: USE_MOCK,
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof KIEAIError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.code === APIErrorCode.UNAUTHORIZED ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
