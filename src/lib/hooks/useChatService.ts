'use client';

import { useState, useCallback } from 'react';
import { Message, Trip } from '../types';

// 示例行程数据，实际应用中会从AI响应中解析
const mockTrip: Trip = {
  destination: '北京',
  duration: '5天4晚',
  travelType: '文化观光',
  days: [
    {
      title: '故宫与天安门广场',
      activities: [
        {
          time: '上午 9:00',
          title: '天安门广场',
          description: '参观世界上最大的城市中心广场，感受庄严的氛围。',
          location: '北京市东城区'
        },
        {
          time: '上午 10:30',
          title: '故宫博物院',
          description: '游览中国明清两代的皇家宫殿，欣赏珍贵文物和宏伟建筑。',
          location: '北京市东城区景山前街4号'
        },
        {
          time: '下午 14:00',
          title: '景山公园',
          description: '登上景山，俯瞰紫禁城全景，是拍摄全景照片的最佳地点。',
          location: '北京市东城区景山前街44号'
        }
      ]
    },
    {
      title: '长城一日游',
      activities: [
        {
          time: '上午 8:00',
          title: '出发前往八达岭长城',
          description: '乘车前往八达岭长城，途中欣赏北京郊区风光。',
          location: '从酒店出发'
        },
        {
          time: '上午 10:00',
          title: '游览八达岭长城',
          description: '攀登中国最具代表性的长城段落，体验"不到长城非好汉"的壮丽。',
          location: '北京市延庆区'
        }
      ]
    }
  ],
  notes: [
    '北京四合院和胡同游览建议请当地导游带领',
    '故宫需要提前网上预约门票',
    '长城游览建议穿舒适的鞋子，带足饮用水'
  ],
  createdAt: Date.now()
};

export function useChatService() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
      // 这里应该调用AI服务的API，现在使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟AI响应
      let aiResponse: Message;
      
      // 如果用户消息包含特定关键词，返回行程
      if (content.toLowerCase().includes('北京') || 
          content.toLowerCase().includes('行程') || 
          content.toLowerCase().includes('旅游') ||
          content.toLowerCase().includes('规划')) {
        aiResponse = {
          role: 'assistant',
          content: `我已为您规划了一个5天4晚的北京旅行行程，包括故宫、天安门、长城等经典景点。您可以在右侧查看详细行程安排，如果需要调整，请告诉我您的偏好。`,
          timestamp: Date.now(),
          tripData: mockTrip
        };
      } else {
        aiResponse = {
          role: 'assistant',
          content: `您好！我是您的智能旅行规划助手。请告诉我您想去的目的地、旅行天数和偏好，我可以为您生成个性化的旅行行程。例如："我想去北京旅游5天，喜欢历史和文化景点。"`,
          timestamp: Date.now()
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了问题。请稍后再试。',
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    loading,
    sendMessage
  };
} 