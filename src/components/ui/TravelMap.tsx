/**
 * 文件名: src/components/ui/TravelMap.tsx
 * 功能描述: 旅行地图组件
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Location } from '@/lib/types';

interface TravelMapProps {
  locations?: Location[];
  onMarkerClick?: (location: Location) => void;
}

// 获取不同天数的颜色
const getDayColor = (dayIndex: number): string => {
  const colors = ['#FF5722', '#2196F3', '#4CAF50', '#9C27B0', '#FFC107', '#795548', '#E91E63'];
  return colors[dayIndex % colors.length];
};

export default function TravelMap({ locations = [], onMarkerClick }: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;
    
    const initMap = async () => {
      try {
        // 加载Leaflet
        if (typeof window !== 'undefined' && !window.L) {
          // 加载CSS
          const linkEl = document.createElement('link');
          linkEl.rel = 'stylesheet';
          linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(linkEl);
          
          // 加载JS
          const scriptEl = document.createElement('script');
          scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          scriptEl.async = true;
          
          await new Promise((resolve) => {
            scriptEl.onload = resolve;
            document.head.appendChild(scriptEl);
          });
        }
        
        // 清理旧实例
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
        
        // 创建地图实例
        mapInstanceRef.current = window.L.map(mapRef.current).setView([35.8617, 104.1954], 4);
        
        // 添加图层
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstanceRef.current);
        
        // 更新标记
        updateMarkers();
        setIsLoading(false);
      } catch (err) {
        console.error('地图加载失败:', err);
        setError('地图加载失败，请刷新页面重试');
        setIsLoading(false);
      }
    };
    
    initMap();
    
    // 清理
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // 更新地图标记
  const updateMarkers = () => {
    if (!mapInstanceRef.current || !locations || !window.L) return;
    
    try {
      // 清除现有标记
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      // 按天数分组位置
      const locationsByDay: Record<number, Location[]> = {};
      locations.forEach(location => {
        const day = location.day || 1;
        if (!locationsByDay[day]) {
          locationsByDay[day] = [];
        }
        locationsByDay[day].push(location);
      });
      
      // 所有有效坐标
      const allCoords: [number, number][] = [];
      
      // 为每天添加标记和路线
      Object.entries(locationsByDay).forEach(([day, dayLocations]) => {
        const dayIndex = parseInt(day, 10) - 1;
        const dayColor = getDayColor(dayIndex);
        const dayCoords: [number, number][] = [];
        
        dayLocations.forEach((location, index) => {
          let coords: [number, number] | undefined;
          
          // 提取坐标
          if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
            coords = location.coordinates;
          } else if (location.lat && location.lng) {
            coords = [Number(location.lat), Number(location.lng)];
          }
          
          if (coords) {
            // 创建标记
            const marker = window.L.marker(coords, {
              title: location.name,
              icon: window.L.divIcon({
                html: `<div style="background-color:${dayColor};color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:bold;">${index + 1}</div>`,
                className: 'map-marker',
                iconSize: [24, 24]
              })
            }).addTo(mapInstanceRef.current);
            
            // 点击事件
            if (onMarkerClick) {
              marker.on('click', () => onMarkerClick(location));
            }
            
            // 添加工具提示
            if (location.name) {
              marker.bindTooltip(location.name);
            }
            
            dayCoords.push(coords);
            allCoords.push(coords);
          }
        });
        
        // 路线连接
        if (dayCoords.length > 1) {
          window.L.polyline(dayCoords, {
            color: dayColor,
            weight: 3,
            opacity: 0.7
          }).addTo(mapInstanceRef.current);
        }
      });
      
      // 调整视图
      if (allCoords.length > 0) {
        mapInstanceRef.current.fitBounds(allCoords);
      }
    } catch (err) {
      console.error('更新地图标记失败:', err);
    }
  };
  
  // 更新标记
  useEffect(() => {
    if (mapInstanceRef.current && window.L && locations.length > 0) {
      updateMarkers();
    }
  }, [locations]);
  
  return (
    <div className="travel-map-container relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
            <p>正在加载地图...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 p-4">
          <div className="text-center max-w-md">
            <h3 className="text-red-600 font-bold mb-2">地图加载失败</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              刷新页面
            </button>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full min-h-[400px]"></div>
    </div>
  );
}

// 全局类型定义
declare global {
  interface Window {
    L: any;
  }
} 