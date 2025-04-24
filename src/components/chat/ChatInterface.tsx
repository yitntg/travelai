/**
 * 文件名: ChatInterface.tsx
 * 功能描述: 聊天界面组件
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { sendMessage } from '@/services/api/chatService';
import { Message } from '@/lib/types';
import { extractTripData } from '@/lib/parser';
import { Spinner } from '../ui/Spinner';

interface ChatInterfaceProps {
  onTripGenerated?: (tripData: any) => void;
}

export default function ChatInterface({ onTripGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是旅行助手，可以帮你规划旅行行程。请告诉我你想去哪里旅行？（例如：我想去北京旅游3天）' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 提取行程数据并通知父组件
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      try {
        const tripData = extractTripData(lastMessage.content);
        if (tripData && onTripGenerated) {
          onTripGenerated(tripData);
        }
      } catch (error) {
        console.error('提取行程数据失败:', error);
      }
    }
  }, [messages, onTripGenerated]);

  // 发送消息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await sendMessage(userMessage.content, messages);
      
      if (response.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
      } else {
        throw new Error('没有收到有效回复');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      showNotification({
        type: 'error',
        title: '发送失败',
        message: '无法获取回复，请稍后再试'
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: '抱歉，我现在无法回答你的问题。请尝试刷新页面或稍后再试。你可以尝试输入：我想去北京旅游3天' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 max-w-[85%] ${
              message.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <div className="whitespace-pre-line">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="rounded-lg p-3 bg-gray-100 text-gray-800 max-w-[85%]">
            <Spinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的旅行计划..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
} 