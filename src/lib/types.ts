/**
 * 文件名: src/lib/types.ts
 * 功能描述: 应用的TypeScript类型定义文件
 * 
 * 包含内容:
 *   - 聊天相关的接口和类型定义
 *   - 旅行行程相关的数据结构定义
 *   - 消息、活动、行程天数等核心类型定义
 */

// 聊天相关类型
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: number;
  tripData?: Trip | null;
}

// 行程相关类型
export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: string;
}

export interface TripDay {
  title: string;
  activities: Activity[];
}

export interface Trip {
  destination: string;
  duration: string;
  travelType: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  budget?: string;
  days: TripDay[];
  notes?: string[];
  createdAt: number;
} 