/**
 * 文件名: src/app/chat/page.tsx
 * 功能描述: 智能旅行规划助手的聊天界面页面组件
 * 
 * 包含内容:
 *   - 聊天界面的主页面组件
 *   - 集成聊天界面和行程展示组件
 *   - 管理生成的行程数据状态
 *   - 响应式布局适配不同设备
 *   - 通过事件总线连接地图和聊天功能
 */

'use client';

import React, { useState } from 'react';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { TravelMap } from '../../components/ui/TravelMap';
import Link from 'next/link';
import type { Location } from '@/lib/types';

export default function ChatPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  
  const handleTripGenerated = (tripData: any) => {
    if (!tripData || !tripData.days) return;
    
    // 从行程数据提取地点信息
    const extractedLocations: Location[] = [];
    
    tripData.days.forEach((day: any, dayIndex: number) => {
      if (day.activities) {
        day.activities.forEach((activity: any, activityIndex: number) => {
          // 使用模拟经纬度，实际应用中可以调用地理编码API
          const baseLat = tripData.destination.includes('北京') ? 39.9 : 31.2;
          const baseLng = tripData.destination.includes('北京') ? 116.3 : 121.4;
          
          extractedLocations.push({
            name: activity.title,
            address: activity.location || `${tripData.destination}市`,
            coordinates: [baseLat + (activityIndex * 0.01), baseLng + (activityIndex * 0.01)],
            day: dayIndex + 1,
            description: activity.description || activity.title,
            order: activityIndex + 1
          });
        });
      }
    });
    
    setLocations(extractedLocations);
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };
  
  const toggleChatSize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* 全屏地图背景 */}
      <div className="absolute inset-0 z-0">
        <TravelMap 
          locations={locations} 
          onMarkerClick={handleMarkerClick}
        />
      </div>
      
      {/* 顶部导航栏 */}
      <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-80 z-10 px-4 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-xl font-semibold text-blue-800">智能旅行规划助手</h1>
          <button 
            onClick={toggleChatSize}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
          >
            {isChatMinimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* 右侧聊天界面 */}
      <div className={`absolute right-4 top-16 bottom-4 z-20 transition-all duration-300 ${isChatMinimized ? 'w-16' : 'w-1/3'}`}>
        <div className={`bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden ${isChatMinimized ? 'p-2' : ''}`}>
          {isChatMinimized ? (
            <button 
              onClick={toggleChatSize}
              className="w-full h-full flex items-center justify-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          ) : (
            <ChatInterface onTripGenerated={handleTripGenerated} />
          )}
        </div>
      </div>
      
      {/* 地点详情弹窗 */}
      {selectedLocation && (
        <div className="absolute left-4 bottom-4 z-20 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-blue-800">{selectedLocation.name}</h3>
            <button 
              onClick={() => setSelectedLocation(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-2">{selectedLocation.address}</p>
          <p className="text-gray-800 mb-2">{selectedLocation.description}</p>
          <div className="bg-blue-50 px-2 py-1 rounded text-sm text-blue-800 inline-block">
            第{selectedLocation.day}天 · {selectedLocation.order && `第${selectedLocation.order}个景点`}
          </div>
        </div>
      )}
    </div>
  );
} 