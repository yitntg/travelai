/**
 * 文件名: chatService.ts
 * 功能描述: 聊天服务API
 */

import { Message } from '@/lib/types';
import { sendChatMessage } from '@/lib/services/apiService';

/**
 * 发送消息到聊天API
 * @param content 用户消息内容
 * @param previousMessages 之前的消息记录
 * @returns 服务器响应
 */
export async function sendMessage(content: string, previousMessages: Message[] = []): Promise<{ content: string }> {
  try {
    console.log('发送消息:', content);
    const response = await sendChatMessage(content);
    return {
      content: response.content
    };
  } catch (error) {
    console.error('聊天服务错误:', error);
    throw error;
  }
} 