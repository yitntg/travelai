/**
 * 文件名: src/components/chat/ChatInterface.tsx
 * 功能描述: 聊天界面组件
 * 
 * 包含内容:
 *   - 用户与AI对话的聊天界面实现
 *   - 消息列表展示和输入框
 *   - 处理消息发送和接收逻辑
 *   - 空状态下的提示信息
 *   - 加载状态的处理
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatService } from '@/lib/hooks/useChatService';
import MessageItem from './MessageItem';

interface ChatInterfaceProps {
  onTripGenerated: (trip: any) => void;
}

export default function ChatInterface({ onTripGenerated }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, loading, sendMessage } = useChatService();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    setInputMessage('');
    await sendMessage(inputMessage);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">与AI助手对话</h2>
        <p className="text-sm text-gray-500">描述您的旅行计划，AI将为您生成定制行程</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-blue-50 rounded-lg max-w-md">
              <h3 className="font-medium text-blue-800 mb-2">开始您的旅行规划</h3>
              <p className="text-gray-600 mb-4">试试这些问题：</p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="bg-white p-2 rounded border border-blue-100 hover:bg-blue-50 cursor-pointer">"我想去北京旅游5天，帮我规划行程"</li>
                <li className="bg-white p-2 rounded border border-blue-100 hover:bg-blue-50 cursor-pointer">"帮我计划一次三亚的海滩度假"</li>
                <li className="bg-white p-2 rounded border border-blue-100 hover:bg-blue-50 cursor-pointer">"我和家人想去云南，有什么好的景点推荐？"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem 
              key={index} 
              message={msg} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="描述您的旅行计划..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              '发送'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 