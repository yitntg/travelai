/**
 * 文件名: src/lib/services/apiService.ts
 * 功能描述: API服务
 * 
 * 包含内容:
 *   - 处理与后端API的通信
 *   - 发送聊天消息
 *   - 处理API错误
 *   - 智能响应不同类型的用户输入
 */

import { Message } from '../types';

// 基本对话响应（用于非旅行相关的问题）
const conversationResponses = {
  greeting: [
    "您好！我是您的智能旅行助手。有什么可以帮到您的吗？",
    "您好，很高兴为您服务。请问您有什么旅行计划需要帮助？",
    "您好！今天想去哪里旅行呢？我可以帮您规划行程。"
  ],
  farewell: [
    "再见，期待下次为您服务！",
    "祝您有愉快的一天！随时回来咨询旅行计划。",
    "再见！期待帮您规划下一次精彩旅程。"
  ],
  thanks: [
    "不客气，这是我的荣幸！",
    "很高兴能帮到您，有任何旅行问题随时问我。",
    "不用谢，为您提供旅行建议是我的工作。"
  ],
  default: [
    "作为旅行助手，我可以帮您规划行程、推荐景点和提供旅行建议。请告诉我您想去哪里旅行，例如「我想去北京旅游5天」。",
    "我专注于旅行规划服务。如果您有特定的目的地和天数，比如「我想去上海玩3天」，我可以为您制定详细行程。",
    "我最擅长旅行规划。请告诉我您的旅行目的地和时间，我会为您推荐最佳行程。"
  ]
};

// 模拟响应数据（当API未实现或出错时使用）
const mockResponses = [
  {
    content: "北京是一个历史悠久的城市，有着丰富的文化景点和美食。根据您的需求，我为您规划了一个5天的北京之旅。以下是详细行程：",
    tripData: {
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
    }
  },
  {
    content: "上海是中国的经济中心，也是一个充满活力和现代化的城市。这座城市融合了传统与现代元素，为游客提供了丰富的体验。以下是我为您规划的上海3天旅行行程：",
    tripData: {
      destination: '上海',
      duration: '3天2晚',
      travelType: '都市体验',
      days: [
        {
          title: '都市景观与历史建筑',
          activities: [
            {
              time: '上午 9:00',
              title: '外滩',
              description: '参观上海最著名的地标，欣赏黄浦江两岸的景色和殖民时期的建筑群。',
              location: '上海市黄浦区中山东一路'
            },
            {
              time: '下午 13:00',
              title: '豫园',
              description: '游览明代园林，体验传统中国园林艺术，品尝当地小吃。',
              location: '上海市黄浦区安仁街218号'
            }
          ]
        },
        {
          title: '现代上海探索',
          activities: [
            {
              time: '上午 10:00',
              title: '上海环球金融中心',
              description: '登上观光台，俯瞰上海全景。',
              location: '上海市浦东新区世纪大道100号'
            },
            {
              time: '下午 14:00',
              title: '南京路步行街',
              description: '在中国最著名的商业街之一购物和品尝当地美食。',
              location: '上海市黄浦区南京东路'
            }
          ]
        }
      ],
      notes: [
        '上海交通便利，建议使用地铁出行',
        '夏季天气炎热，建议携带防晒用品',
        '尝试当地特色小吃，如小笼包、生煎和蟹黄包'
      ],
      createdAt: Date.now()
    }
  }
];

/**
 * 根据用户输入判断意图
 * @param message 用户消息
 * @returns 意图类型
 */
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // 问候语检测
  if (/^(你好|您好|嗨|哈喽|hello|hi|hey)/.test(lowerMessage)) {
    return 'greeting';
  }
  
  // 道别检测
  if (/^(再见|拜拜|goodbye|bye)/.test(lowerMessage)) {
    return 'farewell';
  }
  
  // 感谢检测
  if (/^(谢谢|感谢|thank)/.test(lowerMessage)) {
    return 'thanks';
  }
  
  // 旅行意图检测
  if (/(去|到|游|玩|旅游|旅行|行程|规划)+.*(北京|上海|广州|深圳|成都|西安|杭州|三亚|丽江|厦门)/.test(lowerMessage) ||
      /(北京|上海|广州|深圳|成都|西安|杭州|三亚|丽江|厦门)+.*(去|到|游|玩|旅游|旅行|行程|规划)/.test(lowerMessage) ||
      /(几天|多久|一周|周末)+.*(旅游|旅行|行程|规划)/.test(lowerMessage)) {
    return 'travel_plan';
  }
  
  // 默认为一般咨询
  return 'default';
}

/**
 * 获取随机响应
 * @param responseType 响应类型
 * @returns 随机响应文本
 */
function getRandomResponse(responseType: string): string {
  const responses = conversationResponses[responseType as keyof typeof conversationResponses] || 
                    conversationResponses.default;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

/**
 * 获取匹配的城市
 * @param message 用户消息
 * @returns 城市名称或空字符串
 */
function extractCity(message: string): string {
  const cities = ['北京', '上海', '广州', '深圳', '成都', '西安', '杭州', '三亚', '丽江', '厦门'];
  for (const city of cities) {
    if (message.includes(city)) {
      return city;
    }
  }
  return '';
}

/**
 * 发送聊天消息到API
 * @param message 用户发送的消息
 * @returns API响应
 */
export async function sendChatMessage(message: string): Promise<{ content: string; tripData?: any }> {
  // 使用模拟数据（仅用于演示）
  const useMockData = true;

  if (useMockData) {
    console.log('使用模拟数据响应');
    // 等待1秒模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检测用户意图
    const intent = detectIntent(message);
    console.log('检测用户意图:', intent);
    
    // 根据意图返回不同响应
    if (intent === 'travel_plan') {
      // 旅行规划意图，返回行程
      const city = extractCity(message);
      if (city === '北京') {
        return mockResponses[0];
      } else if (city === '上海') {
        return mockResponses[1];
      } else if (city) {
        // 其他城市默认返回北京的行程（实际应用中应该有更多城市数据）
        const response = {...mockResponses[0]};
        response.content = response.content.replace('北京', city);
        response.tripData = {...response.tripData, destination: city};
        return response;
      } else {
        // 没有提到具体城市
        return {
          content: "您想去哪个城市旅行呢？目前我可以为您规划北京和上海的行程。请告诉我目的地和天数，例如「我想去北京旅游5天」。"
        };
      }
    } else {
      // 非旅行规划意图，返回对话响应
      return {
        content: getRandomResponse(intent)
      };
    }
  }
  
  try {
    console.log('发送API请求:', message);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log('API响应成功:', data);
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 保存旅行行程
 * @param trip 要保存的行程数据
 * @returns 保存结果
 */
export async function saveTrip(trip: any): Promise<{ success: boolean; shareUrl?: string }> {
  try {
    const response = await fetch('/api/trips/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trip }),
    });

    if (!response.ok) {
      throw new Error(`保存行程失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('保存行程错误:', error);
    return { success: false };
  }
} 