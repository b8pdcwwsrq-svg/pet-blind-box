<<<<<<< HEAD
// ===== 拾光事件数据 =====
export interface GlowEvent {
  id: number;
  emoji: string;
  text: string;
  keyword: string;
  period: string[];
  location: string;
}

export interface StickerData {
  id: number;
  name: string;
  dataUrl: string;
  createdAt: string;
}

export interface PlacedSticker {
  stickerId: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface MemoryEntry {
  id: number;
  date: string;
  month: number;
  time: string;
  emoji: string;
  eventText: string;
  keyword: string;
  moodId: string;
  moodLabel: string;
  moodColor: string;
  response: string;
  imageData?: string;
  stickerData?: string;
  location: string;
}

export const ALL_EVENTS: GlowEvent[] = [
  // === 晨间 ===
  { id: 1, emoji: "☀️", text: "试着拉开窗帘，让阳光慢慢洒进来。感受清晨的第一缕光落在皮肤上的温度。", keyword: "晨光", period: ["morning"], location: "窗边" },
  { id: 2, emoji: "🍞", text: "给自己准备一份早餐吧，哪怕只是一片吐司，慢慢咀嚼，感受食物本来的味道。", keyword: "慢食", period: ["morning"], location: "厨房" },
  { id: 3, emoji: "🐦", text: "如果窗外有鸟叫声，停下来听一听。数数有几种不同的旋律。", keyword: "听鸟", period: ["morning"], location: "窗边" },
  { id: 4, emoji: "💧", text: "手边的水杯空了吗？去接一杯温水，感受它缓缓流过喉咙的暖意。", keyword: "温水", period: ["morning", "afternoon", "evening"], location: "桌边" },
  { id: 5, emoji: "🌿", text: "给房间里的绿植浇一点水，和它们说声早安，它们会听见的。", keyword: "浇花", period: ["morning"], location: "阳台" },
  { id: 6, emoji: "🌤️", text: "拍一张今天早上的天空吧，记录下此刻独一无二的光线。", keyword: "天光", period: ["morning"], location: "窗边" },
  { id: 7, emoji: "🪴", text: "摸摸手边最近的那片叶子，感觉它的纹理。它在安静地呼吸着。", keyword: "触叶", period: ["morning", "afternoon"], location: "阳台" },
  { id: 8, emoji: "🪞", text: "洗脸的时候看看镜子里的自己，对自己说声早上好。", keyword: "镜中", period: ["morning"], location: "洗手间" },
  // === 午间 ===
  { id: 9, emoji: "☁️", text: "如果眼睛累了，抬头看看今天的云。看看它像什么", keyword: "观云", period: ["morning", "afternoon"], location: "窗边" },
  { id: 10, emoji: "🎐", text: "打开窗户，闭上眼睛感受三分钟的风。它从很远的地方来，专门路过这里。", keyword: "听风", period: ["anytime"], location: "窗边" },
  { id: 11, emoji: "🍊", text: "剥一个橘子，慢慢吃。吃完后闻闻手上残留的清香，那是阳光的味道。", keyword: "剥橘", period: ["afternoon", "evening"], location: "桌边" },
  { id: 12, emoji: "🍃", text: "出门走走，找一片形状特别的叶子带回来，当作今天的小收藏。", keyword: "拾叶", period: ["morning", "afternoon"], location: "公园" },
  // === 午后 ===
  { id: 13, emoji: "☕", text: "泡一杯温热的饮品，慢慢喝完。感受温暖从喉咙流到胃里。", keyword: "温饮", period: ["morning", "afternoon", "evening"], location: "桌边" },
  { id: 14, emoji: "🍵", text: "泡一杯热茶，捧在手里感受它的温度。不用急着喝，先暖一暖手心。", keyword: "品茶", period: ["afternoon", "evening", "night"], location: "桌边" },
  { id: 15, emoji: "📖", text: "翻开一本书，读一段心动的句子。不用读完，只读一段就好。", keyword: "阅书", period: ["anytime"], location: "沙发" },
  { id: 16, emoji: "🖍️", text: "拿一支笔，在纸上随意涂鸦五分钟。画什么都行，让手自由一点。", keyword: "涂鸦", period: ["anytime"], location: "桌边" },
  { id: 17, emoji: "🎵", text: "戴上耳机，听一首很久没听的轻音乐。让旋律像水一样流过心里。", keyword: "听曲", period: ["anytime"], location: "沙发" },
  { id: 18, emoji: "🪟", text: "走到窗边站一会儿，看一看外面的街道。什么人在经过，什么车在开。", keyword: "看街", period: ["morning", "afternoon"], location: "窗边" },
  // === 户外 ===
  { id: 19, emoji: "🌳", text: "走到最近的树下站一会儿，仰头看看叶子缝隙间的光，它是什么形状的？", keyword: "树下", period: ["morning", "afternoon"], location: "公园" },
  { id: 20, emoji: "🚶", text: "散十分钟步，不用走多远。走慢一点，好好看你的这一段旅途。", keyword: "慢走", period: ["morning", "afternoon", "evening"], location: "马路" },
  { id: 21, emoji: "💐", text: "路过花店或者花坛的时候，停一下。看看今天什么花开得最好。", keyword: "看花", period: ["morning", "afternoon"], location: "马路" },
  { id: 22, emoji: "🪨", text: "在路上找一块特别的石头，带回来放在桌上。它走了很远的路才到这里。", keyword: "拾石", period: ["morning", "afternoon"], location: "路边" },
  { id: 23, emoji: "🌊", text: "如果有水边，去坐一会儿。看水面上的光在跳动，听水的声音。", keyword: "临水", period: ["anytime"], location: "水边" },
  { id: 24, emoji: "🚌", text: "坐一站公交车或者地铁，不看手机，就看看窗外，看看身边的人。", keyword: "乘车", period: ["anytime"], location: "车站" },
  { id: 25, emoji: "🌅", text: "找一个窗户，看看今天天空的颜色。傍晚的天空每天都在画不同的画。", keyword: "晚霞", period: ["evening"], location: "窗边" },
  { id: 26, emoji: "🌆", text: "傍晚的时候出去走走，看看建筑物上的光。傍晚的光有蜂蜜一样的颜色。", keyword: "暮色", period: ["evening"], location: "马路" },
  // === 黄昏/晚间 ===
  { id: 27, emoji: "🕯️", text: "如果家里有香薰蜡烛，点一支，看火焰轻轻跳动，像一颗小小的心脏。", keyword: "烛光", period: ["evening", "night"], location: "卧室" },
  { id: 28, emoji: "🛁", text: "洗一个慢一点的热水澡。感受水从肩膀流到脚尖。", keyword: "慢浴", period: ["evening", "night"], location: "浴室" },
  { id: 29, emoji: "🧴", text: "找一瓶喜欢的乳液或者护手霜，认真涂一遍手。关节、指缝都别漏掉。", keyword: "护手", period: ["anytime"], location: "桌边" },
  { id: 30, emoji: "🧦", text: "换上最舒服的那双袜子。让脚趾也放松一下，它们今天走了不少路。", keyword: "舒足", period: ["anytime"], location: "卧室" },
  { id: 31, emoji: "🫧", text: "认真洗一次手，慢慢搓出一个大大的泡泡，看着它折射出彩虹的颜色。", keyword: "洗手", period: ["anytime"], location: "洗手间" },
  { id: 32, emoji: "🧸", text: "抱抱身边的玩偶，告诉它今天发生了什么。它是这个世界上最好的倾听者。", keyword: "拥抱", period: ["evening", "night"], location: "卧室" },
  // === 夜晚 ===
  { id: 33, emoji: "🌙", text: "看看今晚有没有月亮？如果有，拍下来，留作今天的纪念。", keyword: "望月", period: ["evening", "night"], location: "窗边" },
  { id: 34, emoji: "📝", text: "写下今天三件让人觉得还不错的小事。再小的事也值得被记住。", keyword: "记事", period: ["evening", "night"], location: "桌边" },
  { id: 35, emoji: "💫", text: "对着镜子笑一下，然后对自己说：今天辛苦了，已经做得很好了。", keyword: "自语", period: ["evening", "night"], location: "洗手间" },
  { id: 36, emoji: "🌟", text: "关掉灯，在黑暗中冥想一会，让思绪流过自己。", keyword: "熄灯", period: ["night"], location: "卧室" },
  { id: 37, emoji: "🛏️", text: "整理一下枕头和被子，给自己搭一个舒服的睡觉角落，像搭一个小窝。", keyword: "理榻", period: ["evening", "night"], location: "卧室" },
  { id: 38, emoji: "🎧", text: "睡前听一首很慢的歌。闭上眼睛只听歌，什么都不想。", keyword: "入眠", period: ["night"], location: "床上" },
  { id: 39, emoji: "🌈", text: "想想今天有没有什么让人微笑的瞬间？哪怕只是嘴角轻轻上扬了一下。", keyword: "回味", period: ["evening", "night"], location: "床上" },
  // === 随时 ===
  { id: 40, emoji: "🌸", text: "在房间里找一个喜欢的小物件，拿在手里好好看看它。还记得它是从哪里来的吗？", keyword: "拾物", period: ["anytime"], location: "房间" },
  { id: 41, emoji: "🎨", text: "拿出彩笔，画一个今天看到的颜色。它让你想起了什么？", keyword: "绘色", period: ["anytime"], location: "桌边" },
  { id: 42, emoji: "📸", text: "在房间里找一个角落，拍一张照片。最普通的角落也有好看的角度。", keyword: "寻角", period: ["anytime"], location: "房间" },
  { id: 43, emoji: "🗂️", text: "整理一个抽屉、一个文件夹或者手机里的十张截图。只整理一下就好。", keyword: "小整", period: ["anytime"], location: "桌边" },
  { id: 44, emoji: "🫳", text: "摸一摸身边最近的布料——沙发的、抱枕的、窗帘的。感受它的纹理。", keyword: "触物", period: ["anytime"], location: "沙发" },
  { id: 45, emoji: "🪑", text: "换一个不常坐的位置坐一会儿。从不同的角度看同一个房间。", keyword: "换位", period: ["anytime"], location: "房间" },
  { id: 46, emoji: "📻", text: "打开收音机或者播客，随机听一个台。听听陌生人在说什么。", keyword: "随听", period: ["anytime"], location: "沙发" },
  { id: 47, emoji: "🧶", text: "找一根线或者一根头绳，编一个最简单的结。手指在做重复动作的时候，脑子会安静下来。", keyword: "编结", period: ["anytime"], location: "桌边" },
  { id: 48, emoji: "🥛", text: "倒一杯凉白开，小口小口地喝。凉白开是最好喝的饮料之一。", keyword: "喝水", period: ["anytime"], location: "桌边" },
  { id: 49, emoji: "🕰️", text: "停下来一分钟，什么都不做。就是坐着或者站着，呼吸，等这一分钟过去。", keyword: "止时", period: ["anytime"], location: "任何地方" },
  { id: 50, emoji: "🍂", text: "找一个干燥的、会响的东西——纸、树叶、塑料袋——用手指轻轻捏一下，听它发出的声音。", keyword: "听物", period: ["anytime"], location: "桌边" },
  // === 签文（每日一语） ===
  { id: 51, emoji: "✦", text: "你不需要成为更好的自己，你需要更好地成为自己。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 52, emoji: "✦", text: "活在当下，不是不去想未来，而是不让未来占据现在。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 53, emoji: "✦", text: "你不需要好起来，只要让一切经过你，每一种感受都是作为人的一种难得的体验。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 54, emoji: "✦", text: "迷路有时候也是路的一部分。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 55, emoji: "✦", text: "你本来就是圆满的。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 56, emoji: "✦", text: "安静下来，世界会给出它的答案。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 57, emoji: "✦", text: "你不可能用旧的自己换一个新的未来。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 58, emoji: "✦", text: "不是所有问题都需要被解决，有些只需要放下。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 59, emoji: "✦", text: "充满觉知地体会一下你的呼吸，此时此刻就是每时每刻。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 60, emoji: "✦", text: "在你想要的一切开始之前，先享受你现在所拥有的一切。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 61, emoji: "✦", text: "有时候，停下来本身就是一种前进。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 62, emoji: "✦", text: "你不需要知道终点在哪里，你只需要走好脚下的这一步。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 63, emoji: "✦", text: "内心的平静不是没有风暴，而是在风暴中找到锚。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 64, emoji: "✦", text: "你此刻的存在，就是宇宙想要的样子。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 65, emoji: "✦", text: "万物皆有裂痕，那是光照进来的地方。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 66, emoji: "✦", text: "今天你不需要做到最好，只需要做到自己。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 67, emoji: "✦", text: "你不是在浪费时间，你是在用时间感受生活。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 68, emoji: "✦", text: "把你的注意力放在此刻——因为你只活在此刻。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 69, emoji: "✦", text: "感受不是弱点，感受是你活着的证据。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 70, emoji: "✦", text: "放过自己，不是放弃，而是选择温柔。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 71, emoji: "✦", text: "光不是用来追赶的，是用来感受的。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 72, emoji: "✦", text: "你不必每时每刻都有意义，存在本身就是意义。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 73, emoji: "✦", text: "做一件事最好的时间是现在，其次是下一次你想起来的时候。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 74, emoji: "✦", text: "你不需要完美，你只需要真实。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 75, emoji: "✦", text: "你无法阻止海浪，但可以学会冲浪。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 76, emoji: "✦", text: "允许自己不快乐，是走向快乐的开始。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 77, emoji: "✦", text: "太阳每天都是新的，你也是。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 78, emoji: "✦", text: "当你说'没关系'的时候，记得也对自己说一遍。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 79, emoji: "✦", text: "最长的路是从头脑到心的距离。", keyword: "签文", period: ["anytime"], location: "任何地方" },
  { id: 80, emoji: "✦", text: "每一个今天都是你曾经期待过的未来。", keyword: "签文", period: ["anytime"], location: "任何地方" },
];

// ===== 情绪（日本传统色系，通透有质感） =====
export const ALL_MOODS = [
  { id: "calm", label: "平静", color: "#b4d2dd" },   // 水色 - 清透天空蓝
  { id: "warm", label: "温暖", color: "#e0aeb4" },   // 樱花粉 - 温柔不腻
  { id: "happy", label: "开心", color: "#f8d898" },   // 山吹黄 - 明亮不刺眼
  { id: "sad", label: "低落", color: "#a1c5bd" },     // 若竹绿 - 静谧安宁
  { id: "tired", label: "疲惫", color: "#bda586" },   // 枯茶 - 疲惫不脏
  { id: "confused", label: "困惑", color: "#d2cae0" }, // 藤紫 - 迷惘不阴郁
  { id: "content", label: "满足", color: "#ce764d" },  // 抹茶米 - 暖糯满足
];

// ===== 二十四节气 =====
interface SolarTerm {
  name: string;
  poem: string;
  actions: string[];
  month: number;
  dayRange: [number, number];
  season: "spring" | "summer" | "autumn" | "winter";
}

export const SOLAR_TERMS: SolarTerm[] = [
  { name: "立春", poem: "东风解冻，蛰虫始振。", actions: ["迎春", "舒展", "深呼吸"], month: 2, dayRange: [3, 5], season: "spring" },
  { name: "雨水", poem: "冰雪消融，春雨润物。", actions: ["听雨", "观芽", "慢呼吸"], month: 2, dayRange: [18, 20], season: "spring" },
  { name: "惊蛰", poem: "春雷乍动，万物生机。", actions: ["破土", "拔节", "迎向光"], month: 3, dayRange: [5, 7], season: "spring" },
  { name: "春分", poem: "昼夜均分，阴阳相半。", actions: ["踏青", "寻花", "觅平衡"], month: 3, dayRange: [20, 22], season: "spring" },
  { name: "清明", poem: "气清景明，万物皆显。", actions: ["追风", "释怀", "念故人"], month: 4, dayRange: [4, 6], season: "spring" },
  { name: "谷雨", poem: "雨生百谷，暮春将尽。", actions: ["品茗", "赏牡丹", "惜春光"], month: 4, dayRange: [19, 21], season: "spring" },
  { name: "立夏", poem: "炎夏将至，万物繁茂。", actions: ["听蝉", "尝新", "迎热烈"], month: 5, dayRange: [5, 7], season: "summer" },
  { name: "小满", poem: "麦粒初盈，将满未满。", actions: ["知足", "沉淀", "待丰收"], month: 5, dayRange: [20, 22], season: "summer" },
  { name: "芒种", poem: "连收带种，忙而不盲。", actions: ["播种", "耕耘", "顺其自然"], month: 6, dayRange: [5, 7], season: "summer" },
  { name: "夏至", poem: "白昼至极，万物向阳。", actions: ["追光", "舒展", "汲取能量"], month: 6, dayRange: [21, 23], season: "summer" },
  { name: "小暑", poem: "倏忽温风至，心静自然凉。", actions: ["纳凉", "观荷", "寻清幽"], month: 7, dayRange: [6, 8], season: "summer" },
  { name: "大暑", poem: "骄阳似火，万物极盛。", actions: ["避暑", "饮水", "守清凉"], month: 7, dayRange: [22, 24], season: "summer" },
  { name: "立秋", poem: "暑去凉来，一叶知秋。", actions: ["贴秋膘", "观叶", "感微凉"], month: 8, dayRange: [7, 9], season: "autumn" },
  { name: "处暑", poem: "暑气止息，秋意渐浓。", actions: ["赏云", "敛神", "享清秋"], month: 8, dayRange: [22, 24], season: "autumn" },
  { name: "白露", poem: "露凝而白，秋意微凉。", actions: ["添衣", "观叶", "向内探索"], month: 9, dayRange: [7, 9], season: "autumn" },
  { name: "秋分", poem: "昼夜平分，秋色平分。", actions: ["赏月", "敛气", "觅从容"], month: 9, dayRange: [22, 24], season: "autumn" },
  { name: "寒露", poem: "露气寒冷，将凝结也。", actions: ["登高", "赏菊", "藏暖意"], month: 10, dayRange: [7, 9], season: "autumn" },
  { name: "霜降", poem: "气肃而霜降，阴始凝也。", actions: ["赏柿", "藏锋", "待冬眠"], month: 10, dayRange: [22, 24], season: "autumn" },
  { name: "立冬", poem: "万物收藏，冬之伊始。", actions: ["温食", "添衣", "藏能量"], month: 11, dayRange: [7, 9], season: "winter" },
  { name: "小雪", poem: "气寒将雪，地未封冻。", actions: ["围炉", "煮茶", "享静谧"], month: 11, dayRange: [22, 24], season: "winter" },
  { name: "大雪", poem: "大雪纷飞，万物潜藏。", actions: ["赏雪", "留白", "守宁静"], month: 12, dayRange: [6, 8], season: "winter" },
  { name: "冬至", poem: "极夜虽长，阳气初生。", actions: ["掌灯", "团圆", "待天明"], month: 12, dayRange: [21, 23], season: "winter" },
  { name: "小寒", poem: "寒气至极，岁暮天寒。", actions: ["蛰伏", "蓄力", "盼春归"], month: 1, dayRange: [5, 7], season: "winter" },
  { name: "大寒", poem: "岁末极寒，静待新春。", actions: ["除旧", "迎新", "满欢喜"], month: 1, dayRange: [19, 22], season: "winter" },
];

// ===== 工具函数 =====
export function getCurrentPeriod(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export function getAvailableEvents(usedIds: Set<number>): GlowEvent[] {
  const period = getCurrentPeriod();
  const suitable = ALL_EVENTS.filter(
    (t) => !usedIds.has(t.id) && (t.period.includes(period) || t.period.includes("anytime")),
  );
  if (suitable.length < 3) {
    const allUnused = ALL_EVENTS.filter((t) => !usedIds.has(t.id));
    return allUnused.length > 0 ? allUnused : ALL_EVENTS;
  }
  return suitable;
}

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

function getGanZhiYear(year: number): string {
  const idx = (year - 4) % 60;
  return TIAN_GAN[idx % 10] + DI_ZHI[idx % 12];
}

function getJieQi(month: number, day: number): string {
  const jieQiDays: Record<number, [number, string, number, string]> = {
    1: [6, "小寒", 20, "大寒"],
    2: [4, "立春", 19, "雨水"],
    3: [6, "惊蛰", 21, "春分"],
    4: [5, "清明", 20, "谷雨"],
    5: [6, "立夏", 21, "小满"],
    6: [6, "芒种", 21, "夏至"],
    7: [7, "小暑", 23, "大暑"],
    8: [7, "立秋", 23, "处暑"],
    9: [8, "白露", 23, "秋分"],
    10: [8, "寒露", 23, "霜降"],
    11: [7, "立冬", 22, "小雪"],
    12: [7, "大雪", 22, "冬至"],
  };
  const jq = jieQiDays[month];
  if (!jq) return "";
  if (day >= jq[2]) return jq[3];
  if (day >= jq[0]) return jq[1];
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevJq = jieQiDays[prevMonth];
  return prevJq ? prevJq[3] : "";
}

export function getGanZhiDate(): string {
  const now = new Date();
  const ganZhiYear = getGanZhiYear(now.getFullYear());
  const jieQi = getJieQi(now.getMonth() + 1, now.getDate());
  return jieQi ? `${ganZhiYear}年 · ${jieQi}` : `${ganZhiYear}年`;
}

export function getTodaySolarTerm(): SolarTerm | null {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return SOLAR_TERMS.find((t) => t.month === month && day >= t.dayRange[0] && day <= t.dayRange[1]) || null;
}

export function getSeason(): "spring" | "summer" | "autumn" | "winter" {
  const month = new Date().getMonth() + 1;
  // 以节气为参考：立春(2月)开始为春季
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// ===== 样例数据（首次使用时注入） =====
const SEED_KEY = "fuguang-seeded";

function generateSeedData(): MemoryEntry[] {
  const now = new Date();
  const CY = now.getFullYear();
  const CM = now.getMonth() + 1;
  const CD = now.getDate();
  const seed: MemoryEntry[] = [];
  const moods = ALL_MOODS;
  const events = ALL_EVENTS;

  // 随机选取一条事件作为参考
  const pickEvent = (id: number) => events[id % events.length];
  const pickMood = (id: number) => moods[id % moods.length];

  // 生成过去 30 天的数据（每天 0~3 条）
  for (let d = 29; d >= 0; d--) {
    const date = new Date(CY, CM - 1, CD - d);
    // 前几天多一些条目，越远的越少，模拟真实使用模式
    const count = d < 3 ? Math.floor(Math.random() * 2) + 2 : (d < 14 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2));
    for (let i = 0; i < count; i++) {
      const ev = pickEvent(d * 3 + i + 1);
      const mo = pickMood(d * 2 + i + 3);
      const hour = Math.floor(Math.random() * 14) + 7; // 7:00~20:59
      const minute = Math.floor(Math.random() * 60);
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
      seed.push({
        id: Date.now() + d * 100 + i,
        date: dateStr,
        month: date.getMonth() + 1,
        time: timeStr,
        emoji: ev.emoji,
        eventText: ev.text,
        keyword: ev.keyword,
        moodId: mo.id,
        moodLabel: mo.label,
        moodColor: mo.color,
        response: "",
        location: ev.location,
      });
    }
  }

  // 也生成几个上个月的数据，测试月份切换
  if (CM > 1) {
    for (let d = 0; d < 5; d++) {
      const prevDate = new Date(CY, CM - 2, 15 + d);
      const ev = pickEvent(d + 33);
      const mo = pickMood(d + 5);
      const dateStr = `${prevDate.getMonth() + 1}月${prevDate.getDate()}日`;
      seed.push({
        id: Date.now() + 10000 + d,
        date: dateStr,
        month: prevDate.getMonth() + 1,
        time: `${10 + d}:00`,
        emoji: ev.emoji,
        eventText: ev.text,
        keyword: ev.keyword,
        moodId: mo.id,
        moodLabel: mo.label,
        moodColor: mo.color,
        response: "",
        location: ev.location,
      });
    }
  }

  return seed;
}

export function loadMemoryFromStorage(): MemoryEntry[] {
  try {
    const stored = localStorage.getItem("fuguang-memory");
    if (stored) return JSON.parse(stored);
    // 首次使用：注入样例数据
    if (!localStorage.getItem(SEED_KEY)) {
      const seed = generateSeedData();
      localStorage.setItem("fuguang-memory", JSON.stringify(seed));
      localStorage.setItem(SEED_KEY, "1");
      return seed;
    }
  } catch {}
  return [];
}

export function saveMemoryToStorage(entries: MemoryEntry[]) {
  try {
    localStorage.setItem("fuguang-memory", JSON.stringify(entries));
  } catch {}
}

// ===== 周报/月报统计 =====
export interface PeriodReport {
  totalCount: number;
  moodDistribution: { moodId: string; label: string; color: string; count: number; pct: number }[];
  topKeywords: { keyword: string; count: number }[];
  avgMoodPerDay: number;
  periodLabel: string;
}

export function generateWeekReport(entries: MemoryEntry[]): PeriodReport {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((dayOfWeek + 6) % 7)); // 周一为起点
  weekStart.setHours(0, 0, 0, 0);

  const weekEntries = entries.filter((e) => {
    const [m, d] = e.date.split("月").map((s) => parseInt(s.replace("日", "")));
    const entryDate = new Date(now.getFullYear(), m - 1, d);
    return entryDate >= weekStart && entryDate <= now;
  });

  return buildReport(weekEntries, `${weekStart.getMonth() + 1}月${weekStart.getDate()}日-${now.getMonth() + 1}月${now.getDate()}日`);
}

export function generateMonthReport(entries: MemoryEntry[]): PeriodReport {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthEntries = entries.filter((e) => {
    if (e.month !== now.getMonth() + 1) return false;
    const d = parseInt(e.date.split("月")[1].replace("日", ""));
    const entryDate = new Date(now.getFullYear(), now.getMonth(), d);
    return entryDate >= monthStart && entryDate <= now;
  });

  return buildReport(monthEntries, `${now.getMonth() + 1}月`);
}

function buildReport(entries: MemoryEntry[], periodLabel: string): PeriodReport {
  const totalCount = entries.length;

  // 情绪分布
  const moodMap = new Map<string, { label: string; color: string; count: number }>();
  ALL_MOODS.forEach((m) => moodMap.set(m.id, { label: m.label, color: m.color, count: 0 }));
  entries.forEach((e) => {
    const rec = moodMap.get(e.moodId);
    if (rec) rec.count++;
  });
  const moodDistribution = ALL_MOODS.map((m) => {
    const rec = moodMap.get(m.id)!;
    return {
      moodId: m.id,
      label: m.label,
      color: m.color,
      count: rec.count,
      pct: totalCount > 0 ? Math.round((rec.count / totalCount) * 100) : 0,
    };
  });

  // 高频关键词（取 top 5）
  const kwMap = new Map<string, number>();
  entries.forEach((e) => {
    const kw = e.keyword || e.emoji;
    kwMap.set(kw, (kwMap.get(kw) || 0) + 1);
  });
  const topKeywords = Array.from(kwMap.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const daysInPeriod = entries.length > 0 ? new Set(entries.map((e) => e.date)).size : 1;

  return {
    totalCount,
    moodDistribution,
    topKeywords,
    avgMoodPerDay: Math.round((totalCount / daysInPeriod) * 10) / 10,
    periodLabel,
  };
}

// 根据情绪分布生成一句诗意总结
const POEM_TEMPLATES: Record<string, string[]> = {
  calm: ["这一周，你像水面一样安静。", "你在安静中积蓄力量。"],
  warm: ["这一周，心里有光。", "温暖正在慢慢生长。"],
  happy: ["这一周，有值得微笑的瞬间。", "开心不需要理由。"],
  sad: ["这一周，你允许自己低落。", "低落也是旅程的一部分。"],
  tired: ["这一周，你辛苦了。", "疲惫说明你认真生活了。"],
  confused: ["这一周，迷路也是路。", "困惑是答案的起点。"],
  content: ["这一周，这样就很好。", "满足不是终点，是路上的风景。"],
};

export function generatePoem(report: PeriodReport): string {
  const dominant = report.moodDistribution.reduce((a, b) => (a.count > b.count ? a : b), report.moodDistribution[0]);
  if (!dominant || dominant.count === 0) return "这一周，你在认真地生活。";
  const templates = POEM_TEMPLATES[dominant.moodId] || ["这一周，你体验了很多。"];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ===== 贴纸库存储 =====
const STICKER_STORAGE_KEY = "fuguang-stickers";

export function loadStickersFromStorage(): StickerData[] {
  try {
    const stored = localStorage.getItem(STICKER_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveStickersToStorage(stickers: StickerData[]) {
  try {
    localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(stickers));
  } catch (e) {
    console.warn("贴纸存储空间不足，尝试清理旧贴纸", e);
    // 如果存不下，删除最旧的1/3
    if (stickers.length > 3) {
      const keep = stickers.slice(Math.floor(stickers.length / 3));
      localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(keep));
    }
  }
}

// ===== 碎片 =====

export interface FragmentData {
  id: number;
  text: string;
  stickerId?: number;
  date: string;
  time: string;
  isPreset?: boolean;
}

// 预设碎片 — "陌生人语气"的短句
export const PRESET_FRAGMENTS: string[] = [
  "今天下班看到一只猫蹲在路灯下，好像在等谁。",
  "泡了一杯茉莉花茶，闻到了夏天的味道。",
  "其实我也不知道要说什么，但就是想留点什么。",
  "地铁上有人给老人让座，老人说了三声谢谢。",
  "今天路过花店，买了一支向日葵，插在办公桌上。",
  "雨停了，空气里有泥土的味道，好好闻。",
  "耳机里放到一首很久没听的歌，居然还能跟着唱完。",
  "面试没过，但路边卖烤红薯的大爷多送了我一个。",
  "原来不是只有我会在淋雨的时候笑。",
  "好久没给家里打电话了。",
  "今天煮的方便面比平时好吃，可能是因为加了一个蛋。",
  "看到一对老夫妻牵着手过马路，突然觉得老了也不可怕。",
  "办公室窗外有棵大树，风一吹叶子沙沙响，像在说话。",
  "今天鼓起勇气拒绝了别人的请求，原来拒绝也没那么难。",
  "在旧衣服口袋里翻到了十块钱，开心了一天。",
  "傍晚的天空是粉紫色的，可惜没有人可以分享。",
  "今天做了一件以前不敢做的事，虽然很小，但我做到了。",
  "有时候觉得生活很累，但想到明天还有热干面可以吃，好像又还可以。",
  "今天在电梯里遇到一个陌生人，他帮我按了楼层，我们互相对视笑了一下。",
  "好想去一个谁都不认识我的地方待几天。",
  "今天下雨没带伞，一个陌生人分了我半边伞。原来世界上还是好人多。",
  "看见朋友圈有人去了很美的地方，我替他高兴，但不羡慕。",
  "在某个深夜，突然想明白了之前一直想不通的事。",
  "今天收到一条很久没联系的朋友的消息，他说突然想我了。",
  "今天什么都没做，但感觉很好。",
  "今天我这里下雪了，你那里呢。",
  "有些歌不敢再听了，因为一听就会想起某个人。",
  "今天在路边看到一朵花开得很好，拍了照，不知道发给谁。",
  "突然理解了妈妈以前说的那些话。",
  "其实我也没有很不开心，就是觉得少了点什么。",
  "今天第一次做了蛋糕，虽然塌了，但是挺好吃的。",
  "公交车上看到一个小女孩趴在窗户上画圈圈，好可爱。",
  "今天翻到了去年的日记，发现那时候的我比现在勇敢。",
  "在书店里看到一本书，封面上写着'你不需要好起来'，我哭了。",
  "今天抬头看到天上的云排成一排，像在排队。",
  "一个人去吃火锅，服务员问我几位，我说一位，他说好的请跟我来。",
  "有时候觉得自己什么都做不好，但今天成功地拧开了一瓶罐头。",
  "有些人出现在你的生命里，就是为了教会你一件事，然后离开。",
  "今天在公园长椅上坐了一个小时，什么也没想。",
  "今晚的月亮特别亮，我看了好久。",
];

// ===== 碎片池存储 =====
const FRAGMENT_STORAGE_KEY = "fuguang-fragments";
const FRAGMENT_LAST_WRITE_KEY = "fuguang-fragment-last-write";

export function loadUserFragments(): FragmentData[] {
  try {
    const stored = localStorage.getItem(FRAGMENT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveUserFragments(fragments: FragmentData[]) {
  try {
    localStorage.setItem(FRAGMENT_STORAGE_KEY, JSON.stringify(fragments));
  } catch {}
}

export function getTodayFragmentWritten(): boolean {
  const lastWrite = localStorage.getItem(FRAGMENT_LAST_WRITE_KEY);
  if (!lastWrite) return false;
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  return lastWrite === dateStr;
}

export function markTodayFragmentWritten() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  localStorage.setItem(FRAGMENT_LAST_WRITE_KEY, dateStr);
}

export function getFragmentPool(): FragmentData[] {
  const userFrags = loadUserFragments();
  const presetFrags: FragmentData[] = PRESET_FRAGMENTS.map((text, i) => ({
    id: -i - 1,
    text,
    date: "",
    time: "",
    isPreset: true,
  }));
  return [...presetFrags, ...userFrags];
}
=======
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
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
