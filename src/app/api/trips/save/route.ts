/**
 * 文件名: src/app/api/trips/save/route.ts
 * 功能描述: 保存行程的API端点
 * 
 * 包含内容:
 *   - 处理保存行程请求
 *   - 创建行程分享链接
 */

import { NextResponse } from 'next/server';
import { Trip } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trip } = body;

    if (!trip) {
      return NextResponse.json(
        { error: '请提供有效的行程数据' },
        { status: 400 }
      );
    }

    // 在实际应用中，这里应该将行程数据保存到数据库
    // 为了演示，我们只是创建一个分享链接
    const tripData = encodeURIComponent(JSON.stringify(trip));
    
    // 生成分享URL
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const shareUrl = `${origin}/share/?data=${tripData}`;

    // 返回分享链接
    return NextResponse.json({
      success: true,
      message: '行程已成功保存',
      shareUrl
    });
  } catch (error) {
    console.error('保存行程时出错:', error);
    return NextResponse.json(
      { error: '处理您的请求时发生错误', success: false },
      { status: 500 }
    );
  }
} 