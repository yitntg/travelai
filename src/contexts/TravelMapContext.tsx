/**
 * 文件名: src/contexts/TravelMapContext.tsx
 * 功能描述: 旅行地图数据上下文
 * 
 * 包含内容:
 *   - 管理旅行地点数据
 *   - 提供添加和更新地点的方法
 *   - 跟踪当前选中的旅行日期
 */

'use client';

import React from 'react';
import { LocationPoint } from '../components/ui/TravelMap';

interface TravelMapContextType {
  locations: LocationPoint[];
  activeDay: number | undefined;
  addLocation: (location: Omit<LocationPoint, 'order'>) => void;
  updateLocation: (id: string, location: Partial<LocationPoint>) => void;
  setLocations: (locations: LocationPoint[]) => void;
  clearLocations: () => void;
  setActiveDay: (day: number | undefined) => void;
  getLocationByName: (name: string) => LocationPoint | undefined;
}

const TravelMapContext = React.createContext<TravelMapContextType | undefined>(undefined);

export function useTravelMap() {
  const context = React.useContext(TravelMapContext);
  if (context === undefined) {
    throw new Error('useTravelMap 必须在 TravelMapProvider 内部使用');
  }
  return context;
}

interface TravelMapProviderProps {
  children: React.ReactNode;
}

export function TravelMapProvider({ children }: TravelMapProviderProps) {
  const [locations, setLocationsState] = React.useState<LocationPoint[]>([]);
  const [activeDay, setActiveDay] = React.useState<number | undefined>(undefined);

  const addLocation = (location: Omit<LocationPoint, 'order'>) => {
    // 计算当前天数的地点数，用于设置顺序
    const dayLocations = locations.filter(loc => loc.day === location.day);
    const order = dayLocations.length + 1;
    
    setLocationsState(prev => [...prev, { ...location, order }]);
  };

  const updateLocation = (id: string, updatedFields: Partial<LocationPoint>) => {
    setLocationsState(prev => 
      prev.map(location => 
        location.name === id ? { ...location, ...updatedFields } : location
      )
    );
  };

  const setLocations = (newLocations: LocationPoint[]) => {
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
  };

  const clearLocations = () => {
    setLocationsState([]);
    setActiveDay(undefined);
  };

  const getLocationByName = (name: string) => {
    return locations.find(location => location.name === name);
  };

  const value = {
    locations,
    activeDay,
    addLocation,
    updateLocation,
    setLocations,
    clearLocations,
    setActiveDay,
    getLocationByName
  };

  return (
    <TravelMapContext.Provider value={value}>
      {children}
    </TravelMapContext.Provider>
  );
} 