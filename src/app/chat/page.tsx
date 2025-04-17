/**
 * 文件名: src/app/chat/page.tsx
 * 功能描述: 智能旅行规划助手的聊天界面页面组件
 * 
 * 包含内容:
 *   - 聊天界面的主页面组件
 *   - 集成聊天界面和行程展示组件
 *   - 管理生成的行程数据状态
 *   - 响应式布局适配不同设备
 */

'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import TripDisplay from '@/components/trips/TripDisplay';
import Link from 'next/link';

export default function ChatPage() {
  const [currentTrip, setCurrentTrip] = useState(null);

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <header className="py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-xl font-semibold text-blue-800">智能旅行规划助手</h1>
          <div className="w-24"></div> {/* 占位元素，保持标题居中 */}
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 my-4 overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col">
          <ChatInterface onTripGenerated={setCurrentTrip} />
        </div>
        
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <TripDisplay trip={currentTrip} />
        </div>
      </div>
    </div>
  );
} 