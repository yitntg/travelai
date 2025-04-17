/**
 * 文件名: src/lib/services/apiService.ts
 * 功能描述: API服务
 * 
 * 包含内容:
 *   - 处理与后端API的通信
 *   - 发送聊天消息
 *   - 处理API错误
 */

import { Message } from '../types';

/**
 * 发送聊天消息到API
 * @param message 用户发送的消息
 * @returns API响应
 */
export async function sendChatMessage(message: string): Promise<{ content: string; tripData?: any }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 保存旅行行程
 * @param trip 要保存的行程数据
 * @returns 保存结果
 */
export async function saveTrip(trip: any): Promise<{ success: boolean; shareUrl?: string }> {
  try {
    const response = await fetch('/api/trips/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trip }),
    });

    if (!response.ok) {
      throw new Error(`保存行程失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('保存行程错误:', error);
    return { success: false };
  }
} 