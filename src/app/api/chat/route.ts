/**
 * 文件名: src/app/api/chat/route.ts
 * 功能描述: 处理聊天API请求的路由处理器
 * 
 * 包含内容:
 *   - 处理用户聊天消息的API端点
 *   - 根据用户输入生成旅行行程
 *   - 与DeepSeek AI API集成以提供真正的AI响应
 *   - 返回结构化的行程数据和回复内容
 */

import { NextResponse } from 'next/server';
import { Trip } from '@/lib/types';

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

// 调试信息
console.log('API密钥状态:', DEEPSEEK_API_KEY ? '已配置' : '未配置');

// 旅行城市基本信息（用于提供给AI丰富回答）
const CITY_INFO = {
  '北京': {
    landmarks: '故宫、天安门、长城、颐和园',
    cuisine: '北京烤鸭、炸酱面、豆汁',
    climate: '四季分明，春秋最宜旅游',
    transportation: '地铁发达，公交覆盖全城'
  },
  '上海': {
    landmarks: '外滩、东方明珠、豫园、迪士尼',
    cuisine: '小笼包、生煎、沪菜',
    climate: '亚热带季风气候，夏季高温潮湿',
    transportation: '轨交网络密集，公交覆盖广泛'
  },
  '广州': {
    landmarks: '白云山、陈家祠、沙面、广州塔',
    cuisine: '早茶、烧腊、糖水',
    climate: '亚热带气候，夏长冬短',
    transportation: '地铁便捷，公交遍布'
  }
};

/**
 * 使用DeepSeek API生成智能回复
 * @param message 用户消息
 * @returns AI生成的回复
 */
async function generateDeepSeekResponse(message: string) {
  // 如果缺少API密钥，回退到本地模拟
  if (!DEEPSEEK_API_KEY) {
    console.warn('未配置DeepSeek API密钥，使用本地模拟响应');
    return simulateAIResponse(message);
  }
  
  try {
    console.log('准备调用DeepSeek API...');
    
    // 准备系统提示词
    const systemPrompt = `你是一个专业的旅游顾问机器人，专注于为用户提供个性化的旅行建议和行程规划。
    当用户询问旅行相关问题时，请尽可能提供详细有用的信息，包括：
    - 城市特色和基本介绍
    - 景点推荐（区分首次访问和再次访问）
    - 旅游资源数量（博物馆、公园、历史古迹等）
    - 季节性旅游建议
    - 当地美食和特产
    - 值得注意的文化差异
    
    如果用户没有询问旅行相关问题，请作为一个友好的助手正常回答，但适当引导话题到旅行上。
    如果用户说"你好"之类的问候语，请以友好方式问候并介绍自己是旅行顾问。
    对于没有明确目的地的旅行询问，请推荐几个热门目的地并询问用户偏好。`;
    
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };
    
    console.log('DeepSeek API请求:', JSON.stringify(requestBody, null, 2));
    
    // 发送API请求
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('DeepSeek API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API错误响应:', errorText);
      throw new Error(`DeepSeek API请求失败: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    console.log('DeepSeek API响应成功:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('DeepSeek API响应格式不正确:', data);
      throw new Error('DeepSeek API响应格式不正确');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('调用DeepSeek API出错:', error);
    // 如果API调用失败，回退到本地模拟
    return simulateAIResponse(message);
  }
}

/**
 * 本地模拟AI响应（当DeepSeek API不可用时）
 * @param message 用户消息
 * @returns 模拟的AI响应
 */
function simulateAIResponse(message: string) {
  console.log('使用本地模拟响应来回答:', message);
  const lowerMessage = message.toLowerCase();
  
  // 问候语检测
  if (/^(你好|您好|嗨|哈喽|hello|hi|hey)/.test(lowerMessage)) {
    return `您好！我是您的旅行顾问助手，很高兴为您服务。我可以帮您规划旅行行程、推荐目的地、提供当地美食和景点信息。请问您有什么旅行计划需要我帮忙吗？`;
  }
  
  // 检测包含城市名的旅行询问
  const cityMatch = /北京|上海|广州|成都|西安|杭州|三亚|丽江|厦门/.exec(lowerMessage);
  if (cityMatch && /(去|到|游|玩|旅游|旅行|行程|攻略|规划)/.test(lowerMessage)) {
    const city = cityMatch[0];
    const cityInfo = CITY_INFO[city as keyof typeof CITY_INFO] || {
      landmarks: '各大景点', 
      cuisine: '当地美食',
      climate: '当地气候',
      transportation: '公共交通'
    };
    
    return `${city}是一个非常值得游览的城市！

${city}的主要景点包括${cityInfo.landmarks}。当地的特色美食有${cityInfo.cuisine}。气候特点是${cityInfo.climate}，交通方式主要是${cityInfo.transportation}。

如果您是第一次去${city}，我建议您先游览标志性景点。如果是再次前往，可以探索一些小众但很有特色的地方。

您打算去${city}旅游多少天？喜欢什么类型的景点？了解这些信息我可以为您量身定制一份详细行程。`;
  }
  
  // 默认回复
  return `作为旅行顾问，我可以帮您规划行程、推荐景点和提供旅行建议。请告诉我您想去的目的地、旅行天数和偏好，例如"我想去北京旅游5天，喜欢历史和文化景点"，我就能为您提供专属的旅行计划。`;
}

/**
 * 从AI回复中提取行程数据
 * @param message 用户消息
 * @param aiResponse AI回复内容
 * @returns 结构化的行程数据
 */
function extractTripData(message: string, aiResponse: string): Trip | null {
  // 检测是否包含城市名
  const cityMatch = /北京|上海|广州|成都|西安|杭州|三亚|丽江|厦门/.exec(message);
  if (!cityMatch) return null;
  
  const city = cityMatch[0];
  
  // 检测是否提到天数
  const daysMatch = /(\d+)\s*(天|日)/.exec(message);
  const days = daysMatch ? parseInt(daysMatch[1]) : 3; // 默认3天
  
  // 只有当回复相对较长（可能包含行程）时才生成行程数据
  if (aiResponse.length < 100) return null;
  
  // 创建简单的行程数据结构
  const tripData: Trip = {
    destination: city,
    duration: `${days}天${days-1}晚`,
    travelType: message.includes('文化') ? '文化观光' : 
                message.includes('美食') ? '美食体验' : 
                message.includes('购物') ? '购物休闲' : '综合体验',
    days: [],
    notes: [],
    createdAt: Date.now()
  };
  
  // 生成简单的每日行程
  for (let i = 1; i <= days; i++) {
    tripData.days.push({
      title: `第${i}天行程`,
      activities: [
        {
          time: '上午',
          title: `${city}景点游览`,
          description: '根据AI建议安排具体景点',
          location: city
        },
        {
          time: '下午',
          title: '自由活动',
          description: '可根据个人喜好选择活动',
          location: city
        }
      ]
    });
  }
  
  // 添加旅行注意事项
  tripData.notes = [
    `此行程基于您询问"${message}"生成`,
    '建议在出行前查询最新的景点开放情况',
    '可根据实际情况调整行程安排'
  ];
  
  return tripData;
}

// 处理聊天请求的API端点
export async function POST(request: Request) {
  try {
    console.log('收到聊天API请求');
    const body = await request.json();
    const { message } = body;

    // 验证消息格式
    if (!message || typeof message !== 'string') {
      console.warn('无效的消息内容');
      return NextResponse.json(
        { error: '请提供有效的消息内容' },
        { status: 400 }
      );
    }

    console.log('用户消息:', message);
    
    // 生成AI回复
    const aiResponse = await generateDeepSeekResponse(message);
    console.log('AI回复:', aiResponse);
    
    // 尝试提取行程数据
    const tripData = extractTripData(message, aiResponse);
    console.log('提取的行程数据:', tripData ? '已生成' : '无');

    // 返回响应
    return NextResponse.json({
      content: aiResponse,
      tripData,
      source: DEEPSEEK_API_KEY ? 'deepseek' : 'simulated'
    });
  } catch (error) {
    console.error('处理聊天请求时出错:', error);
    return NextResponse.json(
      { error: '处理您的请求时发生错误，请稍后再试', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 