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

import React, { useEffect, useState } from 'react';
import ChatInterface from '../../components/chat/ChatInterface';
import TravelMap from '../../components/ui/TravelMap';
import Link from 'next/link';
import { LocationPoint } from '../../components/ui/TravelMap';
import ErrorBoundary from '../../components/ErrorBoundary';
import eventBus, { APP_EVENTS } from '../../lib/services/eventBus';

export default function ChatPage() {
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // 监听事件总线上的事件
  useEffect(() => {
    // 监听行程生成事件
    const tripSubscription = eventBus.subscribe(APP_EVENTS.CHAT_TRIP_GENERATED, (tripData: any) => {
      console.log('收到行程数据:', tripData);
      setCurrentTrip(tripData);
    });
    
    // 监听地点更新事件
    const locationsSubscription = eventBus.subscribe(APP_EVENTS.MAP_LOCATIONS_UPDATED, (updatedLocations: LocationPoint[]) => {
      console.log('收到地点更新:', updatedLocations);
      setLocations(updatedLocations);
    });
    
    // 监听地点选择事件
    const locationSelectedSubscription = eventBus.subscribe(APP_EVENTS.MAP_LOCATION_SELECTED, (location: LocationPoint) => {
      console.log('选择地点:', location);
      setSelectedLocation(location);
    });
    
    // 监听地图准备就绪事件
    const mapReadySubscription = eventBus.subscribe(APP_EVENTS.APP_READY, (data: any) => {
      if (data.component === 'map') {
        console.log('地图组件准备就绪');
        setMapReady(true);
      }
    });
    
    // 监听应用错误事件
    const errorSubscription = eventBus.subscribe(APP_EVENTS.APP_ERROR, (error: any) => {
      console.error('应用错误:', error);
      // 这里可以添加全局错误处理逻辑，如显示通知
    });
    
    return () => {
      // 清理订阅
      tripSubscription();
      locationsSubscription();
      locationSelectedSubscription();
      mapReadySubscription();
      errorSubscription();
    };
  }, []);

  const toggleChatSize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  const handleMarkerClick = (location: LocationPoint) => {
    setSelectedLocation(location);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen w-full relative overflow-hidden">
        {/* 全屏地图背景 */}
        <div className="absolute inset-0 z-0">
          <TravelMap 
            locations={locations} 
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
            autoUpdateFromEvents={true}
          />
        </div>
        
        {/* 顶部导航栏 - 半透明 */}
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
        
        {/* 右侧悬浮聊天界面 */}
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
              <ChatInterface />
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
              第{selectedLocation.day}天 · 第{selectedLocation.order}个景点
            </div>
          </div>
        )}
        
        {/* 地图加载状态提示 */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-lg text-blue-800">正在加载地图资源...</p>
              <p className="mt-2 text-sm text-gray-600">首次加载可能需要一些时间，请耐心等待</p>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 