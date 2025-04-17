/**
 * 文件名: src/app/chat/page.tsx
 * 功能描述: 智能旅行规划助手的聊天界面页面组件
 * 
 * 包含内容:
 *   - 聊天界面的主页面组件
 *   - 集成聊天界面和行程展示组件
 *   - 管理生成的行程数据状态
 *   - 响应式布局适配不同设备
 *   - 全屏地图背景与悬浮聊天框
 */

'use client';

import React from 'react';
import ChatInterface from '../../components/chat/ChatInterface';
import TripDisplay from '../../components/trips/TripDisplay';
import TravelMap from '../../components/ui/TravelMap';
import Link from 'next/link';
import { useTravelMap } from '../../contexts/TravelMapContext';
import { LocationPoint } from '../../components/ui/TravelMap';
import ErrorBoundary from '../../components/ErrorBoundary';

// 示例地点数据，实际应用中应从AI响应中提取
const SAMPLE_LOCATIONS: LocationPoint[] = [
  {
    name: '故宫博物院',
    address: '北京市东城区景山前街4号',
    lat: 39.916345,
    lng: 116.397155,
    day: 1,
    description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一',
    order: 1
  },
  {
    name: '天安门广场',
    address: '北京市东城区东长安街',
    lat: 39.903524,
    lng: 116.397436,
    day: 1,
    description: '中华人民共和国的象征，世界上最大的城市广场之一',
    order: 2
  },
  {
    name: '颐和园',
    address: '北京市海淀区新建宫门路19号',
    lat: 39.991284,
    lng: 116.273471,
    day: 2,
    description: '中国清代的皇家园林，以昆明湖、万寿山为基址，以杭州西湖为蓝本',
    order: 1
  }
];

export default function ChatPage() {
  const [currentTrip, setCurrentTrip] = React.useState<any>(null);
  const [isChatMinimized, setIsChatMinimized] = React.useState(false);
  const { locations, setLocations } = useTravelMap();
  const [selectedLocation, setSelectedLocation] = React.useState<LocationPoint | null>(null);

  // 示例：加载示例数据
  React.useEffect(() => {
    // 实际应用中，这里应从AI响应中提取地点信息
    setLocations(SAMPLE_LOCATIONS);
  }, [setLocations]);

  const toggleChatSize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  const handleMarkerClick = (location: LocationPoint) => {
    setSelectedLocation(location);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen w-full relative overflow-hidden">
        {/* 全屏地图背景 - 暂时禁用地图组件，使用临时替代方案 */}
        <div className="absolute inset-0 z-0 bg-gray-100">
          {/* <TravelMap 
            locations={locations} 
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          /> */}
          
          {/* 临时简单地图解决方案 */}
          <div className="w-full h-full" id="tempMap"></div>
          
          {/* 内联脚本用于紧急修复 */}
          <script 
            dangerouslySetInnerHTML={{ 
              __html: `
                // 等待页面完全加载
                window.addEventListener('load', function() {
                  // 清理可能存在的百度地图相关脚本
                  document.querySelectorAll('script[src*="api.map.baidu.com"]').forEach(script => {
                    try {
                      if (script.parentNode) script.parentNode.removeChild(script);
                    } catch (e) {}
                  });
                
                  // 加载Leaflet CSS
                  if (!document.querySelector('link[href*="leaflet.css"]')) {
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(css);
                  }
                
                  // 加载Leaflet JS
                  if (typeof L === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = initTempMap;
                    document.body.appendChild(script);
                  } else {
                    initTempMap();
                  }
                
                  // 初始化临时地图
                  function initTempMap() {
                    const mapContainer = document.getElementById('tempMap');
                    if (!mapContainer) return;
                    
                    // 创建地图实例
                    const map = L.map('tempMap').setView([35.86166, 104.195397], 5);
                    
                    // 添加OSM图层
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                    
                    // 添加示例标记点
                    const markers = [
                      { name: '故宫博物院', lat: 39.916345, lng: 116.397155, day: 1 },
                      { name: '天安门广场', lat: 39.903524, lng: 116.397436, day: 1 },
                      { name: '颐和园', lat: 39.991284, lng: 116.273471, day: 2 }
                    ];
                    
                    // 为每个标记点添加标记
                    markers.forEach((point, index) => {
                      L.marker([point.lat, point.lng])
                        .addTo(map)
                        .bindPopup('<b>' + point.name + '</b><br>第' + point.day + '天')
                        .openPopup();
                    });
                    
                    // 自适应标记点
                    if (markers.length > 0) {
                      const group = new L.featureGroup(markers.map(m => L.marker([m.lat, m.lng])));
                      map.fitBounds(group.getBounds(), { padding: [50, 50] });
                    }
                  }
                });
              `
            }} 
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
              <ChatInterface onTripGenerated={setCurrentTrip} />
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
      </div>
    </ErrorBoundary>
  );
} 