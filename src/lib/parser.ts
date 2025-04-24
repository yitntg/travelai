/**
 * 文件名: parser.ts
 * 功能描述: 消息解析工具
 */

/**
 * 从AI回复中提取行程数据
 * @param content AI回复的内容
 * @returns 结构化的行程数据或null
 */
export function extractTripData(content: string): any | null {
  try {
    // 尝试匹配城市名
    const cityMatch = /北京|上海|广州|成都|西安|杭州|南京|苏州|厦门|深圳|重庆|武汉|长沙|三亚/.exec(content);
    if (!cityMatch) return null;
    
    const city = cityMatch[0];
    
    // 尝试匹配天数
    const daysMatch = /(\d+)天/.exec(content);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    
    // 尝试提取每天的行程
    const dailyActivities = [];
    const dayRegex = /第(\d+)天[\s\S]*?(?=第\d+天|$)/g;
    let dayMatch;
    
    while ((dayMatch = dayRegex.exec(content)) !== null) {
      const dayContent = dayMatch[0];
      const dayNumber = parseInt(dayMatch[1]);
      
      // 提取活动
      const activities = [];
      const activityRegex = /-\s*([^:：]+)[：:]\s*([^\n]+)/g;
      let activityMatch;
      
      while ((activityMatch = activityRegex.exec(dayContent)) !== null) {
        activities.push({
          time: activityMatch[1].trim(),
          title: activityMatch[2].trim(),
          description: '',
          location: `${city}市`
        });
      }
      
      // 如果没有匹配到规范格式的活动，尝试匹配简单格式
      if (activities.length === 0) {
        const simpleActivityRegex = /-\s*([^\n]+)/g;
        let index = 0;
        
        while ((activityMatch = simpleActivityRegex.exec(dayContent)) !== null) {
          activities.push({
            time: `活动${index + 1}`,
            title: activityMatch[1].trim(),
            description: '',
            location: `${city}市`
          });
          index++;
        }
      }
      
      // 如果仍然没有活动，创建一个默认活动
      if (activities.length === 0) {
        activities.push({
          time: '全天',
          title: `${city}自由行`,
          description: '根据个人喜好自由安排行程',
          location: `${city}市`
        });
      }
      
      dailyActivities.push({
        title: `${city}第${dayNumber}天`,
        activities
      });
    }
    
    // 如果没有匹配到天数，创建默认行程
    if (dailyActivities.length === 0) {
      for (let i = 0; i < days; i++) {
        dailyActivities.push({
          title: `${city}第${i + 1}天`,
          activities: [{
            time: '全天',
            title: `${city}自由行`,
            description: '根据个人喜好自由安排行程',
            location: `${city}市`
          }]
        });
      }
    }
    
    // 返回结构化数据
    return {
      destination: city,
      duration: `${days}天${days - 1}晚`,
      travelType: '休闲观光',
      days: dailyActivities
    };
  } catch (error) {
    console.error('解析行程数据失败:', error);
    return null;
  }
} 