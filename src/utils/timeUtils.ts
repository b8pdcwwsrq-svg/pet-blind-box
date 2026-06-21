// 时间相关工具函数

// 根据当前时间获取时间段
export function getCurrentPeriod(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

// 获取时间段问候语
export function getPeriodGreeting(): string {
  const period = getCurrentPeriod();
  switch (period) {
    case 'morning': return '早安，光在呼吸';
    case 'afternoon': return '午后，光在游荡';
    case 'evening': return '傍晚，光在沉淀';
    case 'night': return '夜深，光在安眠';
    default: return '光在呼吸';
  }
}