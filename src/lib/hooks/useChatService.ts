/**
 * 文件名: src/lib/hooks/useChatService.ts
 * 功能描述: 聊天服务的React Hook
 * 
 * 包含内容:
 *   - 管理聊天消息状态
 *   - 处理消息发送和接收
 *   - 与AI服务进行通信
 *   - 模拟示例旅行行程数据
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';
import { sendChatMessage } from '../services/apiService';
import { useTravelMap } from '../../contexts/TravelMapContext';
import { LocationPoint } from '../../components/ui/TravelMap';

export function useChatService() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { setLocations, clearLocations } = useTravelMap();
  
  // 欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '您好！我是您的智能旅行规划助手。请告诉我您想去哪里旅行，我可以帮您规划行程。例如："我想去北京旅游5天，帮我安排行程"',
        timestamp: Date.now()
      }]);
    }
  }, [messages.length]);

  // 从行程数据提取地点信息
  const extractLocationsFromTrip = useCallback((tripData: any) => {
    if (!tripData || !tripData.days) return [];

    const locations: LocationPoint[] = [];
    
    tripData.days.forEach((day: any, dayIndex: number) => {
      if (day.activities) {
        day.activities.forEach((activity: any, activityIndex: number) => {
          if (activity.location && activity.location !== '从酒店出发') {
            // 这里我们使用模拟的经纬度，实际应用中应该调用地理编码API获取真实经纬度
            const baseLat = activity.location.includes('北京') ? 39.9 : 31.2;
            const baseLng = activity.location.includes('北京') ? 116.3 : 121.4;
            
            locations.push({
              name: activity.title,
              address: activity.location,
              lat: baseLat + (activityIndex * 0.01),
              lng: baseLng + (activityIndex * 0.01),
              day: dayIndex + 1,
              description: activity.description,
              order: activityIndex + 1
            });
          }
        });
      }
    });
    
    return locations;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // 调用API服务
      const response = await sendChatMessage(content);
      
      // 处理行程数据，从中提取地理位置信息
      if (response.tripData) {
        const locations = extractLocationsFromTrip(response.tripData);
        setLocations(locations);
      } else {
        // 如果没有行程数据，清除地图上的位置标记
        clearLocations();
      }
      
      // 创建AI响应消息
      const aiResponse: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        tripData: response.tripData
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了问题。请尝试输入"我想去北京旅游5天"或"我想去上海旅游3天"来获取行程规划。',
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  }, [extractLocationsFromTrip, setLocations, clearLocations]);

  return {
    messages,
    loading,
    sendMessage
  };
} 