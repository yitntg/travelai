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