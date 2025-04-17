/**
 * 文件名: src/components/chat/ChatInterface.tsx
 * 功能描述: 聊天界面组件
 * 
 * 包含内容:
 *   - 聊天消息的显示
 *   - 用户输入和发送功能
 *   - 消息加载状态
 *   - 旅行行程数据的展示
 *   - 通过事件总线与其他组件通信
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatService } from '../../lib/hooks/useChatService';
import { Message } from '../../lib/types';

export default function ChatInterface() {
  const { messages, loading, sendMessage } = useChatService();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    await sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="告诉我您想去哪里旅行，如：我想去北京玩5天..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中
              </span>
            ) : '发送'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 内联消息项组件
function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  // 渲染旅行行程数据
  const renderTripData = () => {
    if (!message.tripData) return null;
    
    const { destination, duration, days } = message.tripData;
    
    return (
      <div className="mt-2 bg-blue-50 p-3 rounded-lg">
        <div className="font-semibold text-blue-800 mb-1">
          {destination} · {duration}
        </div>
        
        <div className="space-y-2 mt-2">
          {days && days.slice(0, 2).map((day: any, index: number) => (
            <div key={index} className="border-l-2 border-blue-300 pl-2">
              <div className="font-medium">Day {index + 1}: {day.title}</div>
              <div className="text-xs text-gray-600 pl-1">
                {day.activities && day.activities.slice(0, 2).map((activity: any, i: number) => (
                  <div key={i} className="mt-1">· {activity.title}</div>
                ))}
                {day.activities && day.activities.length > 2 && (
                  <div className="mt-1 text-blue-500">... 更多景点</div>
                )}
              </div>
            </div>
          ))}
          {days && days.length > 2 && (
            <div className="text-center text-blue-500 text-sm mt-1">
              查看完整行程 →
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3/4 rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {renderTripData()}
      </div>
    </div>
  );
} 