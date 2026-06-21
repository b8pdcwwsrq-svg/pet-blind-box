// 每日事件相关工具函数

// 早晨事件
const morningEvents = [
  "清晨的第一缕阳光洒在窗台上",
  "鸟儿在枝头欢快地歌唱",
  "一杯热茶唤醒沉睡的思绪",
  "晨跑时感受微风的轻抚",
  "翻开书本开始新的一天",
  "早餐的香气飘满整个房间",
  "阳光透过窗帘洒在地板上",
  "新的一天开始了，充满希望"
];

// 下午事件
const afternoonEvents = [
  "午后的阳光温暖而慵懒",
  "一杯咖啡伴着窗外的风景",
  "午后的时光总是那么宁静",
  "阳光斜照在桌面上，形成美丽的光斑",
  "微风轻拂，带来一丝凉意",
  "午后的小憩，精力充沛",
  "阳光穿过树叶，在地上投下斑驳的影子",
  "下午的时光，悠然而舒适"
];

// 傍晚事件
const eveningEvents = [
  "夕阳西下，天空染上绚丽的色彩",
  "晚风轻拂，带来一天的宁静",
  "华灯初上，城市的夜晚开始苏醒",
  "晚餐的香气弥漫在空气中",
  "夜幕降临，星光点点",
  "一天的忙碌结束，享受片刻的宁静",
  "夕阳的余晖洒在脸上，温暖而舒适",
  "夜色渐浓，万家灯火点亮夜空"
];

// 夜晚事件
const nightEvents = [
  "夜深人静，星辰闪烁",
  "月光洒在窗台上，静谧而美好",
  "一杯热茶，享受夜的宁静",
  "星空下的思考，内心平静",
  "夜风轻拂，带来一天的安宁",
  "月光如水，洒满大地",
  "夜深了，准备进入梦乡",
  "星辰闪烁，照亮前行的路"
];

// 根据时间段随机获取一个事件
export function getRandomDailyEvent(period: 'morning' | 'afternoon' | 'evening' | 'night'): string {
  let events: string[] = [];
  
  switch (period) {
    case 'morning':
      events = morningEvents;
      break;
    case 'afternoon':
      events = afternoonEvents;
      break;
    case 'evening':
      events = eveningEvents;
      break;
    case 'night':
      events = nightEvents;
      break;
  }
  
  // 随机选择一个事件
  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}