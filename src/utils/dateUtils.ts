// 日期相关工具函数

// 获取干支日期
export function getGanZhiDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 简化版的干支计算，实际应用中需要更精确的计算
  const ganZhi = [
    "甲",
    "乙",
    "丙",
    "丁",
    "戊",
    "己",
    "庚",
    "辛",
    "壬",
    "癸",
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];

  // 简单计算（实际应用中需要更复杂的算法）
  const yearIndex = (year - 4) % 60;
  const yearGan = ganZhi[yearIndex % 10];
  const yearZhi = ganZhi[yearIndex % 12];

  return `${year}年${month}月${day}日 ${yearGan}${yearZhi}年`;
}
