/**
 * 文件名: types.ts
 * 功能描述: 全局类型定义
 */

// 消息角色类型
export type MessageRole = 'user' | 'assistant' | 'system';

// 消息类型
export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: number;
  tripData?: Trip | null;
}

// 旅行行程类型
export interface Trip {
  destination: string;
  duration: string;
  travelType?: string;
  days: TripDay[];
  notes?: string[];
  createdAt?: number;
}

// 行程天数类型
export interface TripDay {
  title: string;
  activities: Activity[];
}

// 活动类型
export interface Activity {
  time: string;
  title: string;
  description?: string;
  location?: string;
}

// 位置类型
export interface Location {
  name: string;
  address?: string;
  description?: string;
  lat?: number;
  lng?: number;
  coordinates?: [number, number];
  day?: number;
  order?: number;
} 