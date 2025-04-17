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
  
  // 初始化地图
  React.useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      // 等待百度地图加载完成
      if (window.BMap) {
        const bmap = new window.BMap.Map(mapRef.current);
        // 默认中心点设为中国中心
        const point = new window.BMap.Point(104.195397, 35.86166);
        bmap.centerAndZoom(point, 5);
        bmap.enableScrollWheelZoom();
        
        // 添加地图控件
        bmap.addControl(new window.BMap.NavigationControl());
        bmap.addControl(new window.BMap.ScaleControl());
        bmap.addControl(new window.BMap.MapTypeControl());
        
        setMap(bmap);
      } else {
        // 百度地图未加载完成，等待加载
        const checkBMap = setInterval(() => {
          if (window.BMap) {
            clearInterval(checkBMap);
            const bmap = new window.BMap.Map(mapRef.current);
            const point = new window.BMap.Point(104.195397, 35.86166);
            bmap.centerAndZoom(point, 5);
            bmap.enableScrollWheelZoom();
            
            bmap.addControl(new window.BMap.NavigationControl());
            bmap.addControl(new window.BMap.ScaleControl());
            bmap.addControl(new window.BMap.MapTypeControl());
            
            setMap(bmap);
          }
        }, 100);
      }
    }
  }, []);
  
  // 更新地图标记
  React.useEffect(() => {
    if (!map || locations.length === 0) return;
    
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
      });
    });
    
    // 调整地图视图以显示所有标记
    if (newMarkers.length > 0) {
      map.setViewport(bounds);
    }
    
    setMarkers(newMarkers);
    setPolylines(newPolylines);
  }, [map, locations, activeDay, onMarkerClick]);
  
  return (
    <div ref={mapRef} className={`w-full h-full ${className}`} />
  );
}

// 为了TypeScript支持百度地图API
declare global {
  interface Window {
    BMap: any;
  }
} 