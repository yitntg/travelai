/**
 * 文件名: src/lib/hooks/useChatService.ts
 * 功能描述: 聊天服务的React Hook
 * 
 * 包含内容:
 *   - 管理聊天消息状态
 *   - 处理消息发送和接收
 *   - 与AI服务进行通信
 *   - 使用事件总线与其他组件通信
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';
import { sendChatMessage } from '../services/apiService';
import eventBus, { APP_EVENTS } from '../services/eventBus';
import { LocationPoint } from '../../components/ui/TravelMap';

export function useChatService() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
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
    
    // 发布消息发送事件
    eventBus.publish(APP_EVENTS.CHAT_MESSAGE_SENT, userMessage);
    
    try {
      // 调用API服务
      const response = await sendChatMessage(content);
      
      // 创建AI响应消息
      const aiResponse: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        tripData: response.tripData
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // 发布响应接收事件
      eventBus.publish(APP_EVENTS.CHAT_RESPONSE_RECEIVED, aiResponse);
      
      // 如果有行程数据，提取地点并发布事件
      if (response.tripData) {
        const locations = extractLocationsFromTrip(response.tripData);
        
        // 同时触发行程生成和地点更新事件
        eventBus.publish(APP_EVENTS.CHAT_TRIP_GENERATED, response.tripData);
        eventBus.publish(APP_EVENTS.MAP_LOCATIONS_UPDATED, locations);
      }
      
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了问题。请尝试输入"我想去北京旅游5天"或"我想去上海旅游3天"来获取行程规划。',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // 发布错误事件
      eventBus.publish(APP_EVENTS.APP_ERROR, {
        source: 'chat',
        message: '发送消息失败',
        error
      });
      
    } finally {
      setLoading(false);
    }
  }, [extractLocationsFromTrip]);

  return {
    messages,
    loading,
    sendMessage
  };
} 