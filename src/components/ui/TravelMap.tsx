/**
 * 文件名: src/components/ui/TravelMap.tsx
 * 功能描述: 全屏旅行地图组件
 * 
 * 包含内容:
 *   - Leaflet地图作为全屏背景
 *   - 支持旅行地点标记
 *   - 支持路线连接和多日行程展示
 *   - 通过事件总线接收位置更新
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import eventBus, { APP_EVENTS } from '../../lib/services/eventBus';

export interface LocationPoint {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  day: number;
  description?: string;
  order: number; // 当天的顺序
}

interface TravelMapProps {
  locations?: LocationPoint[];
  activeDay?: number;
  onMarkerClick?: (location: LocationPoint) => void;
  className?: string;
  autoUpdateFromEvents?: boolean; // 是否自动从事件总线接收更新
}

export default function TravelMap({ 
  locations = [], 
  activeDay,
  onMarkerClick,
  className = '',
  autoUpdateFromEvents = true
}: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polylines, setPolylines] = useState<any[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [mapLocations, setMapLocations] = useState<LocationPoint[]>(locations);
  const mapInstance = useRef<any>(null);
  const maxRetries = 3;
  
  // 从事件总线接收位置更新
  useEffect(() => {
    if (!autoUpdateFromEvents) return;
    
    const unsubscribe = eventBus.subscribe(APP_EVENTS.MAP_LOCATIONS_UPDATED, (updatedLocations: LocationPoint[]) => {
      console.log("从事件总线接收到地点更新:", updatedLocations);
      setMapLocations(updatedLocations);
    });
    
    return () => {
      unsubscribe();
    };
  }, [autoUpdateFromEvents]);
  
  // 当props中的locations变化时更新内部状态
  useEffect(() => {
    if (locations.length > 0) {
      setMapLocations(locations);
    }
  }, [locations]);
  
  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;
    
    try {
      console.log("初始化Leaflet地图...");
      
      // 检查Leaflet是否可用
      if (typeof window === 'undefined' || !window.L) {
        console.error("Leaflet库未加载，手动加载");
        
        // 添加Leaflet CSS
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkEl);
        
        // 添加Leaflet JS
        const scriptEl = document.createElement('script');
        scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptEl.onload = () => {
          console.log("Leaflet已手动加载");
          initializeMap();
        };
        document.body.appendChild(scriptEl);
        return;
      }
      
      initializeMap();
    } catch (error) {
      console.error("初始化地图时出错:", error);
      setMapError(`初始化地图时出错: ${error instanceof Error ? error.message : String(error)}`);
      
      // 报告错误到事件总线
      eventBus.publish(APP_EVENTS.APP_ERROR, {
        source: 'map',
        message: '初始化地图时出错',
        error
      });
    }
    
    // 内部初始化函数
    function initializeMap() {
      if (!mapRef.current || !window.L) return;
      
      // 清理已有地图实例
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      
      // 创建新地图
      try {
        const map = window.L.map(mapRef.current).setView([35.86166, 104.195397], 5);
        
        // 添加地图图层
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // 保存地图实例
        mapInstance.current = map;
        setMapLoaded(true);
        setMapError(null);
        
        console.log("地图初始化成功");
        
        // 通知地图加载完成
        eventBus.publish(APP_EVENTS.APP_READY, { component: 'map' });
        
        // 如果有位置数据，立即更新标记
        if (mapLocations.length > 0) {
          updateMarkers(map, mapLocations);
        }
      } catch (initError) {
        console.error("创建地图实例失败:", initError);
        setMapError(`创建地图失败: ${initError instanceof Error ? initError.message : String(initError)}`);
        
        // 报告错误到事件总线
        eventBus.publish(APP_EVENTS.APP_ERROR, {
          source: 'map',
          message: '创建地图实例失败',
          error: initError
        });
      }
    }
    
    // 组件卸载时清理
    return () => {
      if (mapInstance.current) {
        console.log("清理地图资源");
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [retryCount, mapLocations]);
  
  // 更新地图标记
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded || mapLocations.length === 0) return;
    updateMarkers(mapInstance.current, mapLocations);
  }, [mapLocations, activeDay, onMarkerClick, mapLoaded]);
  
  // 更新标记的函数
  function updateMarkers(map: any, locations: LocationPoint[]) {
    try {
      console.log("更新地图标记...");
      
      // 清除现有标记和线条
      markers.forEach(marker => {
        if (marker && marker.remove) marker.remove();
      });
      polylines.forEach(line => {
        if (line && line.remove) line.remove();
      });
      
      const newMarkers: any[] = [];
      const newPolylines: any[] = [];
      const points: any[] = [];
      
      // 按天数分组
      const locationsByDay = locations.reduce((acc, location) => {
        if (!acc[location.day]) {
          acc[location.day] = [];
        }
        acc[location.day].push(location);
        return acc;
      }, {} as Record<number, LocationPoint[]>);
      
      // 每天的地点按顺序排列
      Object.keys(locationsByDay).forEach(day => {
        locationsByDay[Number(day)].sort((a, b) => a.order - b.order);
      });
      
      // 日期对应的颜色
      const dayColors = [
        '#FF4136', // 红色
        '#0074D9', // 蓝色
        '#2ECC40', // 绿色
        '#FF851B', // 橙色
        '#B10DC9', // 紫色
        '#39CCCC', // 青色
        '#FFDC00', // 黄色
        '#F012BE', // 粉色
        '#01FF70', // 亮绿色
        '#85144b', // 梅红色
      ];
      
      // 添加标记和线条
      Object.entries(locationsByDay).forEach(([day, dayLocations]) => {
        if (activeDay !== undefined && Number(day) !== activeDay) return;
        
        const dayIndex = Number(day) % dayColors.length;
        const color = dayColors[dayIndex];
        
        // 添加地点标记
        dayLocations.forEach((location, index) => {
          try {
            const latlng = window.L.latLng(location.lat, location.lng);
            points.push(latlng);
            
            // 创建标记
            const marker = window.L.marker(latlng)
              .addTo(map)
              .bindPopup(`<b>${location.name}</b><br>第${day}天 - 第${index+1}个景点`);
            
            // 点击事件处理
            marker.on('click', () => {
              // 发布标记点击事件
              eventBus.publish(APP_EVENTS.MAP_LOCATION_SELECTED, location);
              // 调用回调函数（如果有）
              if (onMarkerClick) onMarkerClick(location);
            });
            
            newMarkers.push(marker);
            
            // 如果不是当天最后一个地点，添加到下一个地点的线
            if (index < dayLocations.length - 1) {
              const nextLocation = dayLocations[index + 1];
              const nextLatLng = window.L.latLng(nextLocation.lat, nextLocation.lng);
              
              const line = window.L.polyline([latlng, nextLatLng], {
                color: color,
                weight: 3
              }).addTo(map);
              
              newPolylines.push(line);
            }
          } catch (err) {
            console.error("添加标记时出错:", err);
          }
        });
      });
      
      // 自动调整视图
      if (points.length > 0) {
        const bounds = window.L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      
      setMarkers(newMarkers);
      setPolylines(newPolylines);
    } catch (updateError) {
      console.error("更新标记时出错:", updateError);
      
      // 报告错误到事件总线
      eventBus.publish(APP_EVENTS.APP_ERROR, {
        source: 'map',
        message: '更新标记时出错',
        error: updateError
      });
    }
  }
  
  if (mapError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-red-500 text-center p-4 bg-white rounded shadow-md">
          <h3 className="font-bold mb-2">地图加载错误</h3>
          <p>{mapError}</p>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              disabled={retryCount >= maxRetries}
            >
              {retryCount >= maxRetries ? '已达到重试上限' : '重试加载'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              刷新页面
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px', width: '100%' }}
    >
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-blue-500">正在加载地图...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 全局类型定义
declare global {
  interface Window {
    L: any;
  }
} 