/**
 * 文件名: src/contexts/TravelMapContext.tsx
 * 功能描述: 旅行地图数据上下文
 * 
 * 包含内容:
 *   - 管理旅行地点数据
 *   - 提供添加和更新地点的方法
 *   - 跟踪当前选中的旅行日期
 *   - 与其他模块通过事件通信而非直接引用
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LocationPoint } from '../components/ui/TravelMap';

// 自定义事件类型
export const MAP_EVENTS = {
  LOCATIONS_UPDATED: 'map:locations_updated',
  LOCATION_SELECTED: 'map:location_selected',
  ACTIVE_DAY_CHANGED: 'map:active_day_changed'
};

interface TravelMapContextType {
  locations: LocationPoint[];
  activeDay: number | undefined;
  addLocation: (location: Omit<LocationPoint, 'order'>) => void;
  updateLocation: (id: string, location: Partial<LocationPoint>) => void;
  setLocations: (locations: LocationPoint[]) => void;
  clearLocations: () => void;
  setActiveDay: (day: number | undefined) => void;
  getLocationByName: (name: string) => LocationPoint | undefined;
  selectLocation: (location: LocationPoint | null) => void;
  selectedLocation: LocationPoint | null;
}

const TravelMapContext = createContext<TravelMapContextType | undefined>(undefined);

/**
 * 使用旅行地图上下文的Hook
 * @returns 地图上下文对象
 */
export function useTravelMap() {
  const context = useContext(TravelMapContext);
  if (context === undefined) {
    throw new Error('useTravelMap 必须在 TravelMapProvider 内部使用');
  }
  return context;
}

interface TravelMapProviderProps {
  children: React.ReactNode;
}

/**
 * 旅行地图上下文提供者
 */
export function TravelMapProvider({ children }: TravelMapProviderProps) {
  const [locations, setLocationsState] = useState<LocationPoint[]>([]);
  const [activeDay, setActiveDayState] = useState<number | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);

  // 添加地点
  const addLocation = useCallback((location: Omit<LocationPoint, 'order'>) => {
    // 计算当前天数的地点数，用于设置顺序
    const dayLocations = locations.filter(loc => loc.day === location.day);
    const order = dayLocations.length + 1;
    
    const newLocation = { ...location, order };
    setLocationsState(prev => [...prev, newLocation]);
    
    // 触发事件通知
    dispatchMapEvent(MAP_EVENTS.LOCATIONS_UPDATED, [...locations, newLocation]);
  }, [locations]);

  // 更新地点
  const updateLocation = useCallback((id: string, updatedFields: Partial<LocationPoint>) => {
    setLocationsState(prev => {
      const updated = prev.map(location => 
        location.name === id ? { ...location, ...updatedFields } : location
      );
      dispatchMapEvent(MAP_EVENTS.LOCATIONS_UPDATED, updated);
      return updated;
    });
  }, []);

  // 设置所有地点
  const setLocations = useCallback((newLocations: LocationPoint[]) => {
    // 确保每个地点都有顺序
    const locationsWithOrder = newLocations.map(location => {
      if (location.order === undefined) {
        const dayLocations = newLocations.filter(
          loc => loc.day === location.day && loc.order !== undefined
        );
        return { ...location, order: dayLocations.length + 1 };
      }
      return location;
    });
    
    setLocationsState(locationsWithOrder);
    dispatchMapEvent(MAP_EVENTS.LOCATIONS_UPDATED, locationsWithOrder);
  }, []);

  // 清除所有地点
  const clearLocations = useCallback(() => {
    setLocationsState([]);
    setActiveDayState(undefined);
    dispatchMapEvent(MAP_EVENTS.LOCATIONS_UPDATED, []);
  }, []);

  // 根据名称获取地点
  const getLocationByName = useCallback((name: string) => {
    return locations.find(location => location.name === name);
  }, [locations]);

  // 设置当前活动日期
  const setActiveDay = useCallback((day: number | undefined) => {
    setActiveDayState(day);
    dispatchMapEvent(MAP_EVENTS.ACTIVE_DAY_CHANGED, day);
  }, []);

  // 选择地点
  const selectLocation = useCallback((location: LocationPoint | null) => {
    setSelectedLocation(location);
    dispatchMapEvent(MAP_EVENTS.LOCATION_SELECTED, location);
  }, []);

  // 事件分发器
  const dispatchMapEvent = (eventName: string, detail: any) => {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  };

  // 提供的上下文值
  const value = {
    locations,
    activeDay,
    addLocation,
    updateLocation,
    setLocations,
    clearLocations,
    setActiveDay,
    getLocationByName,
    selectLocation,
    selectedLocation
  };

  return (
    <TravelMapContext.Provider value={value}>
      {children}
    </TravelMapContext.Provider>
  );
} 