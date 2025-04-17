/**
 * 文件名: src/components/chat/MessageItem.tsx
 * 功能描述: 聊天消息项组件
 * 
 * 包含内容:
 *   - 单条消息的显示组件
 *   - 区分用户消息和AI助手消息的样式
 *   - 支持显示行程数据提示
 */

'use client';

import React from 'react';
import { Message } from '@/lib/types';

interface MessageItemProps {
  message: Message;
  key?: React.Key;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.content}
        
        {/* 如果是系统消息且包含行程数据，可以在这里添加显示 */}
        {!isUser && message.tripData && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm border border-blue-100">
            <p className="font-medium text-blue-700">已生成行程规划</p>
          </div>
        )}
      </div>
    </div>
  );
} 