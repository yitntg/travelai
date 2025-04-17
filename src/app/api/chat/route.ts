import { NextResponse } from 'next/server';
import { Trip } from '@/lib/types';

// 模拟处理聊天请求的函数
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // 在这里，你应该调用AI服务，如OpenAI API
    // 这里使用延迟和模拟数据代替
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 基于消息内容生成不同的响应
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的消息内容' },
        { status: 400 }
      );
    }

    let tripData: Trip | null = null;

    // 简单的关键词匹配来生成不同的响应
    // 在实际应用中，这里应该调用更复杂的AI服务
    if (
      message.toLowerCase().includes('北京') || 
      message.toLowerCase().includes('行程') || 
      message.toLowerCase().includes('规划') ||
      message.toLowerCase().includes('旅游')
    ) {
      // 返回示例旅行计划
      tripData = {
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
              }
            ]
          }
        ],
        notes: [
          '北京四合院和胡同游览建议请当地导游带领',
          '故宫需要提前网上预约门票'
        ],
        createdAt: Date.now()
      };

      return NextResponse.json({
        content: `我已为您规划了一个北京的旅行行程，包括故宫、天安门等经典景点。您可以查看详细安排，如需调整请告诉我。`,
        tripData
      });
    }

    // 默认响应
    return NextResponse.json({
      content: `您好！我是您的智能旅行规划助手。请告诉我您想去的目的地、旅行天数和偏好，我可以为您生成个性化的旅行行程。例如："我想去北京旅游5天，喜欢历史和文化景点。"`
    });
  } catch (error) {
    console.error('处理聊天请求时出错:', error);
    return NextResponse.json(
      { error: '处理您的请求时发生错误' },
      { status: 500 }
    );
  }
} 