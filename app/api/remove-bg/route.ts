import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  try {
    // 检查 API key
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error('REMOVE_BG_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are supported.' },
        { status: 400 }
      );
    }

    // 验证文件大小 (12MB 是 Remove.bg 的限制，但我们限制为 5MB 以节省带宽)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    console.log(`Processing image: ${file.name} (${file.type}, ${file.size} bytes)`);

    // 将 File 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 准备发送到 Remove.bg 的 FormData
    const form = new FormData();
    form.append('image_file', buffer, {
      filename: file.name,
      contentType: file.type,
    });
    form.append('size', 'auto'); // 自动检测最佳尺寸
    form.append('format', 'png'); // 输出格式

    // 调用 Remove.bg API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
      headers: {
        ...form.getHeaders(),
        'X-Api-Key': apiKey,
      },
      responseType: 'arraybuffer', // 接收二进制图片数据
      timeout: 30000, // 30秒超时
    });

    // 检查响应
    if (!response.data || response.data.length === 0) {
      throw new Error('Empty response from Remove.bg');
    }

    // 返回 PNG 图片
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"',
        'Cache-Control': 'no-store', // 不缓存，每次都是新图片
      },
    });

  } catch (error: any) {
    console.error('Remove.bg API error:', error.message);

    // 处理 axios 错误
    if (error.response) {
      // Remove.bg API 返回的错误
      const errorText = Buffer.from(error.response.data).toString('utf8');
      console.error('Remove.bg API response error:', error.response.status, errorText);
      
      let message = 'Background removal failed';
      if (error.response.status === 402) {
        message = 'API quota exceeded. Please try again later.';
      } else if (error.response.status === 400) {
        message = 'Invalid image or unsupported format.';
      } else if (error.response.status === 403) {
        message = 'Invalid API key.';
      } else if (error.response.status === 429) {
        message = 'Too many requests. Please wait a moment.';
      }

      return NextResponse.json(
        { error: message },
        { status: error.response.status }
      );
    }

    // 其他错误
    return NextResponse.json(
      { error: 'Failed to remove background. Please try again.' },
      { status: 500 }
    );
  }
}

// 配置 Next.js API 路由
export const config = {
  api: {
    bodyParser: false, // 禁用默认的 body parser，使用 formData
  },
};