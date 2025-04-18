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

// 城市信息数据库
const cityInfoDatabase = {
  '北京': {
    name: '北京',
    intro: '北京是中国的首都，拥有3000多年的悠久历史和灿烂文化，是世界著名的古都和现代化国际大都市。',
    resources: {
      museums: 148,
      parks: 226,
      historicalSites: 98,
      shoppingAreas: 52,
      foodStreets: 37
    },
    firstVisit: [
      '故宫博物院',
      '天安门广场',
      '八达岭长城',
      '颐和园',
      '天坛公园'
    ],
    repeatedVisit: [
      '798艺术区',
      '南锣鼓巷',
      '什刹海',
      '香山公园',
      '世界公园'
    ],
    boundary: {
      center: { lat: 39.9042, lng: 116.4074 },
      radius: 50 // 公里
    }
  },
  '上海': {
    name: '上海',
    intro: '上海是中国最大的经济中心城市，国际化大都市，有"东方巴黎"和"东方明珠"的美誉。',
    resources: {
      museums: 87,
      parks: 156,
      historicalSites: 64,
      shoppingAreas: 93,
      foodStreets: 42
    },
    firstVisit: [
      '外滩',
      '东方明珠',
      '豫园',
      '南京路步行街',
      '上海迪士尼乐园'
    ],
    repeatedVisit: [
      '田子坊',
      '1933老场坊',
      '朱家角古镇',
      '世博会博物馆',
      '上海野生动物园'
    ],
    boundary: {
      center: { lat: 31.2304, lng: 121.4737 },
      radius: 40 // 公里
    }
  },
  '广州': {
    name: '广州',
    intro: '广州是广东省省会，中国南方最大城市，拥有2200多年历史，被誉为"千年商都"。',
    resources: {
      museums: 52,
      parks: 93,
      historicalSites: 78,
      shoppingAreas: 64,
      foodStreets: 86
    },
    firstVisit: [
      '陈家祠',
      '白云山',
      '沙面岛',
      '广州塔',
      '上下九步行街'
    ],
    repeatedVisit: [
      '岭南印象园',
      '长隆野生动物世界',
      '广州博物馆',
      '广州艺术博物院',
      '花城广场'
    ],
    boundary: {
      center: { lat: 23.1291, lng: 113.2644 },
      radius: 35 // 公里
    }
  },
  '成都': {
    name: '成都',
    intro: '成都是四川省省会，中国西部地区重要的中心城市，有"天府之国"的美誉，以熊猫和美食闻名于世。',
    resources: {
      museums: 47,
      parks: 74,
      historicalSites: 56,
      shoppingAreas: 43,
      foodStreets: 94
    },
    firstVisit: [
      '成都大熊猫繁育研究基地',
      '锦里古街',
      '宽窄巷子',
      '杜甫草堂',
      '武侯祠'
    ],
    repeatedVisit: [
      '青城山',
      '都江堰',
      '成都博物馆',
      '望江楼公园',
      '西岭雪山'
    ],
    boundary: {
      center: { lat: 30.5728, lng: 104.0668 },
      radius: 30 // 公里
    }
  },
  '西安': {
    name: '西安',
    intro: '西安是陕西省省会，中国四大古都之一，拥有3000多年历史，是中华文明和中华民族重要发祥地之一。',
    resources: {
      museums: 68,
      parks: 45,
      historicalSites: 118,
      shoppingAreas: 37,
      foodStreets: 62
    },
    firstVisit: [
      '兵马俑',
      '大雁塔',
      '城墙',
      '回民街',
      '华清宫'
    ],
    repeatedVisit: [
      '大唐芙蓉园',
      '陕西历史博物馆',
      '华山',
      '钟鼓楼',
      '大明宫国家遗址公园'
    ],
    boundary: {
      center: { lat: 34.3416, lng: 108.9398 },
      radius: 25 // 公里
    }
  }
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
      cityInfo: cityInfoDatabase['北京'],
      isFirstVisit: true,
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
      cityInfo: cityInfoDatabase['上海'],
      isFirstVisit: true,
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
      /(几天|多久|一周|周末)+.*(旅游|旅行|行程|规划)/.test(lowerMessage) ||
      /(推荐|有什么好玩的|哪里好玩|去哪玩|怎么玩)/.test(lowerMessage)) {
    return 'travel_plan';
  }
  
  // 访问次数检测
  if (/(第一次|首次|没去过)/.test(lowerMessage)) {
    return 'first_visit';
  }
  
  if (/(第二次|再次|又|已经去过|去过了)/.test(lowerMessage)) {
    return 'repeated_visit';
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
  const cities = Object.keys(cityInfoDatabase);
  for (const city of cities) {
    if (message.includes(city)) {
      return city;
    }
  }
  return '';
}

/**
 * 判断是否是首次访问
 * @param message 用户消息
 * @returns 是否是首次访问
 */
function isFirstTimeVisit(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  // 检测是否明确提到首次访问
  if (/(第一次|首次|没去过|从未去过)/.test(lowerMessage)) {
    return true;
  }
  
  // 检测是否明确提到再次访问
  if (/(第二次|再次|又|已经去过|去过了|再来)/.test(lowerMessage)) {
    return false;
  }
  
  // 默认为首次访问
  return true;
}

/**
 * 生成城市基本信息介绍
 * @param city 城市名
 * @param isFirstVisit 是否首次访问
 * @returns 城市介绍文本
 */
function generateCityIntro(city: string, isFirstVisit: boolean): string {
  const cityInfo = cityInfoDatabase[city as keyof typeof cityInfoDatabase];
  if (!cityInfo) return '';
  
  const { intro, resources, firstVisit, repeatedVisit } = cityInfo;
  const recommendSpots = isFirstVisit ? firstVisit : repeatedVisit;
  const visitType = isFirstVisit ? '首次' : '再次';
  
  return `${intro}

${city}拥有丰富的旅游资源，包括${resources.museums}座博物馆、${resources.parks}个公园、${resources.historicalSites}处历史古迹、${resources.shoppingAreas}个购物区和${resources.foodStreets}条美食街。

对于${visitType}到访${city}的游客，我推荐您优先考虑以下景点：
${recommendSpots.map((spot, index) => `${index + 1}. ${spot}`).join('\n')}

下面是我为您量身定制的详细行程：`;
}

/**
 * 发送聊天消息到API
 * @param message 用户发送的消息
 * @returns API响应
 */
export async function sendChatMessage(message: string): Promise<{ content: string; tripData?: any }> {
  // 使用真实API（不再使用模拟数据）
  const useMockData = false;

  if (useMockData) {
    console.log('使用模拟数据响应');
    // 等待1秒模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检测用户意图
    const intent = detectIntent(message);
    console.log('检测用户意图:', intent);
    
    // 根据意图返回不同响应
    if (intent === 'travel_plan' || intent === 'first_visit' || intent === 'repeated_visit') {
      // 旅行规划意图，返回行程
      const city = extractCity(message);
      const isFirstTime = intent === 'first_visit' ? true : (intent === 'repeated_visit' ? false : isFirstTimeVisit(message));
      
      if (city && cityInfoDatabase[city as keyof typeof cityInfoDatabase]) {
        let baseResponse;
        if (city === '北京') {
          baseResponse = {...mockResponses[0]};
        } else if (city === '上海') {
          baseResponse = {...mockResponses[1]};
        } else {
          // 其他城市默认使用北京的行程结构
          baseResponse = JSON.parse(JSON.stringify(mockResponses[0]));
          baseResponse.tripData.destination = city;
        }
        
        // 添加城市信息和访问类型
        baseResponse.tripData.cityInfo = cityInfoDatabase[city as keyof typeof cityInfoDatabase];
        baseResponse.tripData.isFirstVisit = isFirstTime;
        
        // 更新内容包含城市基本情况
        const cityIntro = generateCityIntro(city, isFirstTime);
        baseResponse.content = cityIntro + '\n\n' + baseResponse.content.replace(/^[^。]+。/, '');
        
        // 如果是再次访问，调整推荐景点
        if (!isFirstTime && baseResponse.tripData.days) {
          const repeatedVisitSpots = cityInfoDatabase[city as keyof typeof cityInfoDatabase]?.repeatedVisit || [];
          
          // 替换部分景点为适合再次访问的景点
          let spotIndex = 0;
          baseResponse.tripData.days.forEach((day: { activities?: { title: string; description: string }[] }) => {
            if (day.activities && day.activities.length > 0) {
              const randomActivity = Math.floor(Math.random() * day.activities.length);
              if (spotIndex < repeatedVisitSpots.length) {
                day.activities[randomActivity].title = repeatedVisitSpots[spotIndex];
                day.activities[randomActivity].description = `作为${city}的深度景点，${repeatedVisitSpots[spotIndex]}非常适合再次到访的游客。`;
                spotIndex++;
              }
            }
          });
          
          // 添加特别说明
          baseResponse.tripData.notes.push(`这个行程专为再次到访${city}的游客设计，侧重于深度体验。`);
        }
        
        return baseResponse;
      } else if (city) {
        // 有城市但没有详细数据
        return {
          content: `${city}是一个非常有魅力的城市。不过我目前没有${city}的详细数据。您是想了解北京、上海、广州、成都或西安的旅游信息吗？这些城市我有更详细的资料。`
        };
      } else {
        // 没有提到具体城市
        return {
          content: "您想去哪个城市旅行呢？目前我可以为您提供北京、上海、广州、成都和西安的详细旅游资讯和行程规划。请告诉我目的地和天数，例如「我想去北京旅游5天」，以及是否是您第一次到访这个城市。"
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