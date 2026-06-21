// 记忆相关工具函数

// 记录类型
export interface MemoryEntry {
  id: string;
  date: string;
  time: string;
  type: 'photo' | 'text' | 'mood';
  keyword: string;
  description: string;
  moodId?: string;
  moodColor?: string;
  imageData?: string;
  month?: number;
}

// 心情类型
export interface MoodType {
  id: string;
  label: string;
  color: string;
  inkColor: string;
}

// 所有心情类型
export const ALL_MOODS: MoodType[] = [
  { id: 'peaceful', label: '平静', color: '#A8D0D0', inkColor: '#2C5F7C' },
  { id: 'happy', label: '开心', color: '#FFD166', inkColor: '#4C4C4C' },
  { id: 'excited', label: '兴奋', color: '#EF476F', inkColor: '#FFFFFF' },
  { id: 'sad', label: '难过', color: '#1B9AAA', inkColor: '#FFFFFF' },
  { id: 'angry', label: '生气', color: '#9B5DE5', inkColor: '#FFFFFF' },
  { id: 'tired', label: '疲惫', color: '#F15BB5', inkColor: '#FFFFFF' },
  { id: 'anxious', label: '焦虑', color: '#00BBF9', inkColor: '#FFFFFF' },
  { id: 'confused', label: '困惑', color: '#FEE440', inkColor: '#4C4C4C' },
  { id: 'grateful', label: '感激', color: '#00F5D4', inkColor: '#4C4C4C' },
  { id: 'inspired', label: '灵感', color: '#9B5DE5', inkColor: '#FFFFFF' },
  { id: 'lonely', label: '孤独', color: '#8338EC', inkColor: '#FFFFFF' },
  { id: 'hopeful', label: '希望', color: '#06FFA5', inkColor: '#4C4C4C' }
];

// 根据季节获取心情类型
export function getSeasonMoods(): MoodType[] {
  const month = new Date().getMonth() + 1;
  
  // 春季心情
  if (month >= 3 && month <= 5) {
    return [
      ALL_MOODS.find(m => m.id === 'peaceful')!,
      ALL_MOODS.find(m => m.id === 'happy')!,
      ALL_MOODS.find(m => m.id === 'excited')!,
      ALL_MOODS.find(m => m.id === 'inspired')!,
      ALL_MOODS.find(m => m.id === 'hopeful')!,
      ALL_MOODS.find(m => m.id === 'grateful')!
    ];
  }
  
  // 夏季心情
  if (month >= 6 && month <= 8) {
    return [
      ALL_MOODS.find(m => m.id === 'excited')!,
      ALL_MOODS.find(m => m.id === 'happy')!,
      ALL_MOODS.find(m => m.id === 'peaceful')!,
      ALL_MOODS.find(m => m.id === 'inspired')!,
      ALL_MOODS.find(m => m.id === 'tired')!,
      ALL_MOODS.find(m => m.id === 'grateful')!
    ];
  }
  
  // 秋季心情
  if (month >= 9 && month <= 11) {
    return [
      ALL_MOODS.find(m => m.id === 'peaceful')!,
      ALL_MOODS.find(m => m.id === 'grateful')!,
      ALL_MOODS.find(m => m.id === 'hopeful')!,
      ALL_MOODS.find(m => m.id === 'sad')!,
      ALL_MOODS.find(m => m.id === 'lonely')!,
      ALL_MOODS.find(m => m.id === 'inspired')!
    ];
  }
  
  // 冬季心情
  return [
    ALL_MOODS.find(m => m.id === 'peaceful')!,
    ALL_MOODS.find(m => m.id === 'hopeful')!,
    ALL_MOODS.find(m => m.id === 'lonely')!,
    ALL_MOODS.find(m => m.id === 'sad')!,
    ALL_MOODS.find(m => m.id === 'confused')!,
    ALL_MOODS.find(m => m.id === 'grateful')!
  ];
}

// 从本地存储加载记忆
export function loadMemoryFromStorage(): MemoryEntry[] {
  try {
    const stored = localStorage.getItem('fuguang-memory');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

// 保存记忆到本地存储
export function saveMemoryToStorage(entries: MemoryEntry[]) {
  try {
    localStorage.setItem('fuguang-memory', JSON.stringify(entries));
  } catch {}
}

// 生成月度报告文案
export function generateMonthlyReport(memoryEntries: MemoryEntry[], monthlyData: { message: string }): string {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const thisMonthEntries = memoryEntries.filter(e => e.month === currentMonth);
  
  if (thisMonthEntries.length === 0) return '';
  
  const dayMap: Record<number, MemoryEntry[]> = {};
  thisMonthEntries.forEach(e => {
    const day = parseInt(e.date.split('月')[1].replace('日', ''));
    if (!dayMap[day]) dayMap[day] = [];
    dayMap[day].push(e);
  });
  
  const days = Object.keys(dayMap).map(Number).sort((a, b) => a - b);
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const firstEntry = dayMap[firstDay][0];
  const lastEntry = dayMap[lastDay][0];
  
  const firstMood = ALL_MOODS.find(m => m.id === firstEntry.moodId)?.label || '';
  const lastMood = ALL_MOODS.find(m => m.id === lastEntry.moodId)?.label || '';
  
  const firstDateShort = firstEntry.date.replace('月', '·').replace('日', '');
  const lastDateShort = lastEntry.date.replace('月', '·').replace('日', '');
  const totalDays = days.length;
  
  // 叙事流畅型合并文案
  if (totalDays === 1) {
    return `这个月共捡拾了1天的时光。${firstDateShort}，${firstEntry.keyword}时，心情如${firstMood}般温柔。这份心境，正如${monthlyData.message.replace('这个月，', '').replace('。', '')}。`;
  }
  
  return `这个月共捡拾了${totalDays}天的时光。从${firstDateShort}${firstEntry.keyword}时${firstMood}温柔的初遇，到${lastDateShort}${lastEntry.keyword}时${lastMood}的心境，${monthlyData.message.replace('这个月', '').replace('。', '')}。`;
}

// ===== 二十四节气 =====
interface SolarTerm {
  name: string
  poem: string
  actions: string[]
  month: number
  dayRange: [number, number]
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

const SOLAR_TERMS: SolarTerm[] = [
  { name: '立春', poem: '东风解冻，蛰虫始振。', actions: ['迎春', '舒展', '深呼吸'], month: 2, dayRange: [3, 5], season: 'spring' },
  { name: '雨水', poem: '冰雪消融，春雨润物。', actions: ['听雨', '观芽', '慢呼吸'], month: 2, dayRange: [18, 20], season: 'spring' },
  { name: '惊蛰', poem: '春雷乍动，万物生机。', actions: ['破土', '拔节', '迎向光'], month: 3, dayRange: [5, 7], season: 'spring' },
  { name: '春分', poem: '昼夜均分，阴阳相半。', actions: ['踏青', '寻花', '觅平衡'], month: 3, dayRange: [20, 22], season: 'spring' },
  { name: '清明', poem: '气清景明，万物皆显。', actions: ['追风', '释怀', '念故人'], month: 4, dayRange: [4, 6], season: 'spring' },
  { name: '谷雨', poem: '雨生百谷，暮春将尽。', actions: ['品茗', '赏牡丹', '惜春光'], month: 4, dayRange: [19, 21], season: 'spring' },
  { name: '立夏', poem: '炎夏将至，万物繁茂。', actions: ['听蝉', '尝新', '迎热烈'], month: 5, dayRange: [5, 7], season: 'summer' },
  { name: '小满', poem: '麦粒初盈，将满未满。', actions: ['知足', '沉淀', '待丰收'], month: 5, dayRange: [20, 22], season: 'summer' },
  { name: '芒种', poem: '连收带种，忙而不盲。', actions: ['播种', '耕耘', '顺其自然'], month: 6, dayRange: [5, 7], season: 'summer' },
  { name: '夏至', poem: '白昼至极，万物向阳。', actions: ['追光', '舒展', '汲取能量'], month: 6, dayRange: [20, 22], season: 'summer' },
  { name: '小暑', poem: '倏忽温风至，心静自然凉。', actions: ['纳凉', '观荷', '寻清幽'], month: 7, dayRange: [6, 8], season: 'summer' },
  { name: '大暑', poem: '骄阳似火，万物极盛。', actions: ['避暑', '饮水', '守清凉'], month: 7, dayRange: [22, 24], season: 'summer' },
  { name: '立秋', poem: '暑去凉来，一叶知秋。', actions: ['贴秋膘', '观叶', '感微凉'], month: 8, dayRange: [7, 9], season: 'autumn' },
  { name: '处暑', poem: '暑气止息，秋意渐浓。', actions: ['赏云', '敛神', '享清秋'], month: 8, dayRange: [22, 24], season: 'autumn' },
  { name: '白露', poem: '露凝而白，秋意微凉。', actions: ['添衣', '观叶', '向内探索'], month: 9, dayRange: [7, 9], season: 'autumn' },
  { name: '秋分', poem: '昼夜平分，秋色平分。', actions: ['赏月', '敛气', '觅从容'], month: 9, dayRange: [22, 24], season: 'autumn' },
  { name: '寒露', poem: '露气寒冷，将凝结也。', actions: ['登高', '赏菊', '藏暖意'], month: 10, dayRange: [7, 9], season: 'autumn' },
  { name: '霜降', poem: '气肃而霜降，阴始凝也。', actions: ['赏柿', '藏锋', '待冬眠'], month: 10, dayRange: [22, 24], season: 'autumn' },
  { name: '立冬', poem: '万物收藏，冬之伊始。', actions: ['温食', '添衣', '藏能量'], month: 11, dayRange: [7, 9], season: 'winter' },
  { name: '小雪', poem: '气寒将雪，地未封冻。', actions: ['围炉', '煮茶', '享静谧'], month: 11, dayRange: [22, 24], season: 'winter' },
  { name: '大雪', poem: '大雪纷飞，万物潜藏。', actions: ['赏雪', '留白', '守宁静'], month: 12, dayRange: [6, 8], season: 'winter' },
  { name: '冬至', poem: '极夜虽长，阳气初生。', actions: ['掌灯', '团圆', '待天明'], month: 12, dayRange: [21, 23], season: 'winter' },
  { name: '小寒', poem: '寒气至极，岁暮天寒。', actions: ['蛰伏', '蓄力', '盼春归'], month: 1, dayRange: [5, 7], season: 'winter' },
  { name: '大寒', poem: '岁末极寒，静待新春。', actions: ['除旧', '迎新', '满欢喜'], month: 1, dayRange: [19, 22], season: 'winter' },
]

export function getSolarTermInfo(): { name: string; date: string; actions: string[] } | null {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const term = SOLAR_TERMS.find(t => t.month === month && day >= t.dayRange[0] && day <= t.dayRange[1])
  if (!term) return null
  return {
    name: term.name,
    date: `${month}月${day}日`,
    actions: term.actions,
  }
}
