/**
 * 文件名: src/components/ui/TravelMap.tsx
 * 功能描述: 全屏旅行地图组件
 * 
 * 包含内容:
 *   - 百度地图作为全屏背景
 *   - 支持旅行地点标记
 *   - 支持路线连接和多日行程展示
 */

'use client';

import React from 'react';
import { useEffect, useState } from 'react';

// 帮助检查是否在客户端环境
const isClient = typeof window !== 'undefined';

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
  locations: LocationPoint[];
  activeDay?: number;
  onMarkerClick?: (location: LocationPoint) => void;
  className?: string;
}

export default function TravelMap({ 
  locations = [], 
  activeDay,
  onMarkerClick,
  className = ''
}: TravelMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<any>(null);
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [polylines, setPolylines] = React.useState<any[]>([]);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;
  const [domReady, setDomReady] = React.useState(false);
  
  // 检查DOM是否已加载
  React.useEffect(() => {
    if (!isClient) return; // 只在客户端执行
    
    setDomReady(true);
    
    // 调试信息
    console.log("DOM已加载，地图容器状态:", {
      mapRefExists: !!mapRef.current,
      mapRefWidth: mapRef.current?.offsetWidth,
      mapRefHeight: mapRef.current?.offsetHeight
    });
    
    return () => setDomReady(false);
  }, []);
  
  // 检查百度地图API是否加载
  React.useEffect(() => {
    if (!isClient) return; // 只在客户端执行
    
    // 如果DOM未准备好，不执行初始化
    if (!domReady) {
      console.log("DOM未准备好，等待DOM加载完成");
      return;
    }
    
    const checkBMapExists = () => {
      const exists = typeof window !== 'undefined' && window.BMap !== undefined;
      console.log(`百度地图API检查: ${exists ? '已加载' : '未加载'}`);
      return exists;
    };
    
    // 手动加载百度地图API
    const loadBMapScript = () => {
      if (typeof window === 'undefined' || document.getElementById('baidu-map-api')) {
        return;
      }
      
      console.log('手动加载百度地图API脚本');
      const script = document.createElement('script');
      script.id = 'baidu-map-api';
      script.src = 'https://api.map.baidu.com/api?v=3.0&ak=rGqFAjHlqKe8hiP3GIpG1tDqeQMdjjZ8&callback=initBMap';
      script.async = true;
      
      // 当脚本加载完成后初始化地图
      window.initBMap = () => {
        console.log('百度地图API通过手动脚本加载完成');
        initializeMap();
      };
      
      document.body.appendChild(script);
    };
    
    const initializeMap = () => {
      try {
        console.log("初始化地图...");
        if (!mapRef.current) {
          console.log("地图容器未找到", {
            domReady,
            mapRefExists: !!mapRef.current,
            documentReady: document.readyState
          });
          // 如果DOM已经准备好但仍找不到容器，可能是React渲染问题
          // 设置一个短暂的延迟再尝试
          setTimeout(() => {
            if (mapRef.current) {
              console.log("延迟后找到地图容器，开始初始化");
              initializeMap();
            } else {
              setMapError("地图容器未找到 - 请尝试刷新页面");
            }
          }, 500);
          return;
        }
        
        const bmap = new window.BMap.Map(mapRef.current);
        // 默认中心点设为中国中心
        const point = new window.BMap.Point(104.195397, 35.86166);
        bmap.centerAndZoom(point, 5);
        bmap.enableScrollWheelZoom();
        
        // 添加地图控件
        try {
          bmap.addControl(new window.BMap.NavigationControl());
          bmap.addControl(new window.BMap.ScaleControl());
          bmap.addControl(new window.BMap.MapTypeControl());
        } catch (controlError) {
          console.error("添加地图控件时出错:", controlError);
        }
        
        console.log("地图初始化成功");
        setMap(bmap);
        setMapLoaded(true);
        setMapError(null); // 清除错误状态
      } catch (initError) {
        console.error("初始化地图时出错:", initError);
        setMapError(`初始化地图时出错: ${initError instanceof Error ? initError.message : String(initError)}`);
      }
    };
    
    if (checkBMapExists()) {
      console.log("百度地图API已加载，开始初始化");
      initializeMap();
    } else {
      console.log("等待百度地图API加载...");
      
      // 如果经过一定时间地图API仍未加载，尝试手动加载
      setTimeout(() => {
        if (!checkBMapExists()) {
          console.log("百度地图API未自动加载，尝试手动加载");
          loadBMapScript();
        }
      }, 2000);
      
      const maxWaitTime = 10000; // 10秒
      const startTime = Date.now();
      
      const checkBMapInterval = setInterval(() => {
        if (checkBMapExists()) {
          console.log("百度地图API已加载，开始初始化");
          clearInterval(checkBMapInterval);
          initializeMap();
        } else if (Date.now() - startTime > maxWaitTime) {
          clearInterval(checkBMapInterval);
          console.error("百度地图API加载超时");
          setMapError("百度地图API加载失败，请检查网络连接或刷新页面");
        }
      }, 500);
      
      // 清理函数
      return () => clearInterval(checkBMapInterval);
    }
  }, [retryCount, domReady]); // 添加domReady作为依赖项
  
  // 更新地图标记
  React.useEffect(() => {
    if (!map || locations.length === 0 || !mapLoaded) return;
    
    try {
      console.log("更新地图标记...", locations);
      
      // 清除现有标记和线条
      markers.forEach(marker => map.removeOverlay(marker));
      polylines.forEach(line => map.removeOverlay(line));
      
      const newMarkers: any[] = [];
      const newPolylines: any[] = [];
      const bounds = new window.BMap.Bounds();
      
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
        const dayIndex = Number(day) % dayColors.length;
        const color = activeDay ? (Number(day) === activeDay ? dayColors[dayIndex] : '#AAAAAA') : dayColors[dayIndex];
        
        if (activeDay && Number(day) !== activeDay) return;
        
        // 添加地点标记
        dayLocations.forEach((location, index) => {
          try {
            const point = new window.BMap.Point(location.lng, location.lat);
            bounds.extend(point);
            
            // 创建标记
            const marker = new window.BMap.Marker(point, {
              icon: new window.BMap.Symbol('circle', {
                scale: 1,
                fillColor: color,
                fillOpacity: 0.8,
                strokeColor: '#FFFFFF'
              })
            });
            
            // 添加标签
            const label = new window.BMap.Label(`Day${day}-${index+1}: ${location.name}`, {
              offset: new window.BMap.Size(20, 0)
            });
            marker.setLabel(label);
            
            // 添加点击事件
            if (onMarkerClick) {
              marker.addEventListener('click', () => {
                onMarkerClick(location);
              });
            }
            
            map.addOverlay(marker);
            newMarkers.push(marker);
            
            // 如果不是当天最后一个地点，添加到下一个地点的线
            if (index < dayLocations.length - 1) {
              const nextLocation = dayLocations[index + 1];
              const nextPoint = new window.BMap.Point(nextLocation.lng, nextLocation.lat);
              
              const polyline = new window.BMap.Polyline([point, nextPoint], {
                strokeColor: color,
                strokeWeight: 3,
                strokeOpacity: 0.8
              });
              
              map.addOverlay(polyline);
              newPolylines.push(polyline);
            }
          } catch (markerError) {
            console.error("创建标记时出错:", markerError);
          }
        });
      });
      
      // 调整地图视图以显示所有标记
      if (newMarkers.length > 0) {
        try {
          map.setViewport(bounds);
        } catch (viewportError) {
          console.error("设置视图范围时出错:", viewportError);
        }
      }
      
      setMarkers(newMarkers);
      setPolylines(newPolylines);
      console.log("地图标记更新完成");
    } catch (updateError) {
      console.error("更新地图标记时出错:", updateError);
      setMapError(`更新地图标记时出错: ${updateError instanceof Error ? updateError.message : String(updateError)}`);
    }
  }, [map, locations, activeDay, onMarkerClick, mapLoaded]);
  
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
          <p className="mt-2 text-xs text-gray-500">
            如果问题持续，请检查您的网络连接或浏览器设置
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`} 
      id="baiduMap"
      style={{ minHeight: '400px', width: '100%', position: 'relative' }}
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

// 为了TypeScript支持百度地图API
declare global {
  interface Window {
    BMap: any;
    initBMap?: () => void;
  }
} 