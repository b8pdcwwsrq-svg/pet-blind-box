import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FuguangTimeline from "./components/FuguangTimeline";

// ===== 拾光事件数据 =====
interface GlowEvent {
  id: number;
  emoji: string;
  text: string;
  keyword: string;
  period: string[];
}

const ALL_EVENTS: GlowEvent[] = [
  {
    id: 1,
    emoji: "☀️",
    text: "要不要试着拉开窗帘，让阳光慢慢洒进来？感受清晨的第一缕光落在皮肤上的温度。",
    keyword: "晨光",
    period: ["morning"],
  },
  {
    id: 2,
    emoji: "🍞",
    text: "试着给自己准备一份早餐吧，哪怕只是一片吐司，慢慢咀嚼，感受食物本来的味道。",
    keyword: "慢食",
    period: ["morning"],
  },
  {
    id: 3,
    emoji: "🐦",
    text: "如果窗外有鸟叫声，要不要停下来听一听？数数有几种不同的旋律。",
    keyword: "听鸟",
    period: ["morning"],
  },
  {
    id: 4,
    emoji: "💧",
    text: "手边的水杯空了吗？去接一杯温水，感受它缓缓流过喉咙的暖意吧。",
    keyword: "温水",
    period: ["morning", "afternoon", "evening"],
  },
  {
    id: 5,
    emoji: "🌿",
    text: "试着给房间里的绿植浇一点水，和它们说声早安，它们会听见的。",
    keyword: "浇花",
    period: ["morning"],
  },
  {
    id: 6,
    emoji: "🌤️",
    text: "如果方便的话，拍一张今天早上的天空吧，记录下此刻独一无二的光线。",
    keyword: "天光",
    period: ["morning"],
  },
  {
    id: 7,
    emoji: "🎵",
    text: "要不要戴上耳机，听一首你很久没听的轻音乐？让旋律像水一样流过心里。",
    keyword: "听曲",
    period: ["anytime"],
  },
  {
    id: 8,
    emoji: "☁️",
    text: "如果眼睛累了，抬头看看今天的云吧。试着说说它像什么，像棉花糖还是像小猫？",
    keyword: "观云",
    period: ["morning", "afternoon"],
  },
  {
    id: 9,
    emoji: "📖",
    text: "试着翻开一本书，读一段让你心动的句子。不用读完，只读一段就好。",
    keyword: "阅书",
    period: ["anytime"],
  },
  {
    id: 10,
    emoji: "🖍️",
    text: "拿一支笔，在纸上随意涂鸦五分钟吧。画什么都行，让手自由一点。",
    keyword: "涂鸦",
    period: ["anytime"],
  },
  {
    id: 11,
    emoji: "🍊",
    text: "试着剥一个橘子，慢慢吃。吃完后闻闻手上残留的清香，那是阳光的味道。",
    keyword: "剥橘",
    period: ["afternoon", "evening"],
  },
  {
    id: 12,
    emoji: "🍃",
    text: "如果愿意出门走走，试着找一片形状特别的叶子带回来，当作今天的小收藏。",
    keyword: "拾叶",
    period: ["morning", "afternoon"],
  },
  {
    id: 13,
    emoji: "🎐",
    text: "试着打开窗户，闭上眼睛感受三分钟的风。它从很远的地方来，专门路过你。",
    keyword: "听风",
    period: ["anytime"],
  },
  {
    id: 14,
    emoji: "🧦",
    text: "换上最舒服的那双袜子吧，让脚趾也放松一下，它们今天走了不少路呢。",
    keyword: "舒足",
    period: ["anytime"],
  },
  {
    id: 15,
    emoji: "🫧",
    text: "试着认真洗一次手，慢慢搓出一个大大的泡泡，看着它折射出彩虹的颜色。",
    keyword: "洗手",
    period: ["anytime"],
  },
  {
    id: 16,
    emoji: "🌅",
    text: "找一个窗户，看看今天天空的颜色吧。傍晚的天空每天都在画不同的画。",
    keyword: "晚霞",
    period: ["evening"],
  },
  {
    id: 17,
    emoji: "🕯️",
    text: "如果家里有香薰蜡烛，试着点一支，看火焰轻轻跳动，像一颗小小的心脏。",
    keyword: "烛光",
    period: ["evening", "night"],
  },
  {
    id: 18,
    emoji: "🍵",
    text: "试着泡一杯热茶，捧在手里感受它的温度。不用急着喝，先暖一暖手心。",
    keyword: "品茶",
    period: ["afternoon", "evening", "night"],
  },
  {
    id: 19,
    emoji: "🧸",
    text: "抱抱你的玩偶吧，告诉它今天发生了什么。它是这个世界上最好的倾听者。",
    keyword: "拥抱",
    period: ["evening", "night"],
  },
  {
    id: 20,
    emoji: "🌙",
    text: "看看今晚有没有月亮？如果有，试着拍下来，留作今天的纪念。",
    keyword: "望月",
    period: ["evening", "night"],
  },
  {
    id: 21,
    emoji: "📝",
    text: "试着写下今天三件让你觉得还不错的小事。再小的事也值得被记住。",
    keyword: "记事",
    period: ["evening", "night"],
  },
  {
    id: 22,
    emoji: "🎨",
    text: "拿出彩笔，试着画一个你今天看到的颜色。不用画得像，画出感觉就好。",
    keyword: "绘色",
    period: ["anytime"],
  },
  {
    id: 23,
    emoji: "💫",
    text: "试着对着镜子笑一下，然后对自己说：今天辛苦了，你已经做得很好了。",
    keyword: "自语",
    period: ["evening", "night"],
  },
  {
    id: 24,
    emoji: "🌟",
    text: "试着关掉灯，在黑暗中看三分钟手机屏幕外的世界。黑暗里藏着很多安静的声音。",
    keyword: "熄灯",
    period: ["night"],
  },
  {
    id: 25,
    emoji: "🛏️",
    text: "试着整理一下枕头和被子，给自己搭一个舒服的睡觉角落，像搭一个小窝。",
    keyword: "理榻",
    period: ["evening", "night"],
  },
  {
    id: 26,
    emoji: "🌸",
    text: "在房间里找一个你喜欢的小物件，拿在手里好好看看它。它为什么让你喜欢？",
    keyword: "拾物",
    period: ["anytime"],
  },
  {
    id: 27,
    emoji: "☕",
    text: "试着给自己泡一杯温热的饮品，慢慢喝完。感受温暖从喉咙流到胃里。",
    keyword: "温饮",
    period: ["morning", "afternoon", "evening"],
  },
  {
    id: 28,
    emoji: "🌈",
    text: "试着想想今天有没有什么让你微笑的瞬间？哪怕只是嘴角轻轻上扬了一下。",
    keyword: "回味",
    period: ["evening", "night"],
  },
];

function getCurrentPeriod(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

function getAvailableEvents(usedIds: Set<number>): GlowEvent[] {
  const period = getCurrentPeriod();
  const suitable = ALL_EVENTS.filter(
    (t) =>
      !usedIds.has(t.id) &&
      (t.period.includes(period) || t.period.includes("anytime")),
  );
  if (suitable.length < 3) {
    const allUnused = ALL_EVENTS.filter((t) => !usedIds.has(t.id));
    return allUnused.length > 0 ? allUnused : ALL_EVENTS;
  }
  return suitable;
}

// ===== 干支节气 =====
const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = [
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

function getGanZhiDate(): string {
  const now = new Date();
  const ganZhiYear = getGanZhiYear(now.getFullYear());
  const jieQi = getJieQi(now.getMonth() + 1, now.getDate());
  return jieQi ? `${ganZhiYear}年 · ${jieQi}` : `${ganZhiYear}年`;
}

function getTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// ===== 季节 & 情绪（精简） =====
function getSeason(): "spring" | "summer" | "autumn" | "winter" {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

const ALL_MOODS = [
  { id: "calm", label: "平静", color: "#8CB4C4" },
  { id: "warm", label: "温暖", color: "#D4A4A8" },
  { id: "sad", label: "低落", color: "#A4C4B8" },
  { id: "tired", label: "疲惫", color: "#C8C888" },
];

// ===== 四季音乐 =====
const SEASON_MUSIC: Record<string, string[]> = {
  spring: [
    "https://cdn.pixabay.com/download/audio/2025/04/23/audio_aa2166c7d2.mp3?filename=musicword-gentle-spring-331529.mp3",
    "https://cdn.pixabay.com/download/audio/2026/04/25/audio_926b18edb7.mp3?filename=atlasaudio-ambient-nature-518687.mp3",
  ],
  summer: [
    "https://cdn.pixabay.com/download/audio/2026/03/31/audio_9677a14be6.mp3?filename=atlasaudio-warm-piano-512015.mp3",
    "https://cdn.pixabay.com/download/audio/2022/07/30/audio_0fea22d728.mp3?filename=sergepavkinmusic-smooth-waters-115977.mp3",
  ],
  autumn: [
    "https://cdn.pixabay.com/download/audio/2023/10/15/audio_7156378de9.mp3?filename=the_mountain-autumn-171603.mp3",
    "https://cdn.pixabay.com/download/audio/2026/03/28/audio_4acb1675b5.mp3?filename=atlasaudio-piano-relaxing-510242.mp3",
  ],
  winter: [
    "https://cdn.pixabay.com/download/audio/2025/05/15/audio_6feb3fcf47.mp3?filename=clavier-music-cold-bench-in-central-park-ambient-music-342454.mp3",
    "https://cdn.pixabay.com/download/audio/2026/04/23/audio_a45fc6bbad.mp3?filename=leberch-meditation-meditation-music-523576.mp3",
  ],
};

// ===== 二十四节气 =====
interface SolarTerm {
  name: string;
  poem: string;
  actions: string[];
  month: number;
  dayRange: [number, number];
  season: "spring" | "summer" | "autumn" | "winter";
}

const SOLAR_TERMS: SolarTerm[] = [
  {
    name: "立春",
    poem: "东风解冻，蛰虫始振。",
    actions: ["迎春", "舒展", "深呼吸"],
    month: 2,
    dayRange: [3, 5],
    season: "spring",
  },
  {
    name: "雨水",
    poem: "冰雪消融，春雨润物。",
    actions: ["听雨", "观芽", "慢呼吸"],
    month: 2,
    dayRange: [18, 20],
    season: "spring",
  },
  {
    name: "惊蛰",
    poem: "春雷乍动，万物生机。",
    actions: ["破土", "拔节", "迎向光"],
    month: 3,
    dayRange: [5, 7],
    season: "spring",
  },
  {
    name: "春分",
    poem: "昼夜均分，阴阳相半。",
    actions: ["踏青", "寻花", "觅平衡"],
    month: 3,
    dayRange: [20, 22],
    season: "spring",
  },
  {
    name: "清明",
    poem: "气清景明，万物皆显。",
    actions: ["追风", "释怀", "念故人"],
    month: 4,
    dayRange: [4, 6],
    season: "spring",
  },
  {
    name: "谷雨",
    poem: "雨生百谷，暮春将尽。",
    actions: ["品茗", "赏牡丹", "惜春光"],
    month: 4,
    dayRange: [19, 21],
    season: "spring",
  },
  {
    name: "立夏",
    poem: "炎夏将至，万物繁茂。",
    actions: ["听蝉", "尝新", "迎热烈"],
    month: 5,
    dayRange: [5, 7],
    season: "summer",
  },
  {
    name: "小满",
    poem: "麦粒初盈，将满未满。",
    actions: ["知足", "沉淀", "待丰收"],
    month: 5,
    dayRange: [20, 22],
    season: "summer",
  },
  {
    name: "芒种",
    poem: "连收带种，忙而不盲。",
    actions: ["播种", "耕耘", "顺其自然"],
    month: 6,
    dayRange: [5, 7],
    season: "summer",
  },
  {
    name: "夏至",
    poem: "白昼至极，万物向阳。",
    actions: ["追光", "舒展", "汲取能量"],
    month: 6,
    dayRange: [21, 23],
    season: "summer",
  },
  {
    name: "小暑",
    poem: "倏忽温风至，心静自然凉。",
    actions: ["纳凉", "观荷", "寻清幽"],
    month: 7,
    dayRange: [6, 8],
    season: "summer",
  },
  {
    name: "大暑",
    poem: "骄阳似火，万物极盛。",
    actions: ["避暑", "饮水", "守清凉"],
    month: 7,
    dayRange: [22, 24],
    season: "summer",
  },
  {
    name: "立秋",
    poem: "暑去凉来，一叶知秋。",
    actions: ["贴秋膘", "观叶", "感微凉"],
    month: 8,
    dayRange: [7, 9],
    season: "autumn",
  },
  {
    name: "处暑",
    poem: "暑气止息，秋意渐浓。",
    actions: ["赏云", "敛神", "享清秋"],
    month: 8,
    dayRange: [22, 24],
    season: "autumn",
  },
  {
    name: "白露",
    poem: "露凝而白，秋意微凉。",
    actions: ["添衣", "观叶", "向内探索"],
    month: 9,
    dayRange: [7, 9],
    season: "autumn",
  },
  {
    name: "秋分",
    poem: "昼夜平分，秋色平分。",
    actions: ["赏月", "敛气", "觅从容"],
    month: 9,
    dayRange: [22, 24],
    season: "autumn",
  },
  {
    name: "寒露",
    poem: "露气寒冷，将凝结也。",
    actions: ["登高", "赏菊", "藏暖意"],
    month: 10,
    dayRange: [7, 9],
    season: "autumn",
  },
  {
    name: "霜降",
    poem: "气肃而霜降，阴始凝也。",
    actions: ["赏柿", "藏锋", "待冬眠"],
    month: 10,
    dayRange: [22, 24],
    season: "autumn",
  },
  {
    name: "立冬",
    poem: "万物收藏，冬之伊始。",
    actions: ["温食", "添衣", "藏能量"],
    month: 11,
    dayRange: [7, 9],
    season: "winter",
  },
  {
    name: "小雪",
    poem: "气寒将雪，地未封冻。",
    actions: ["围炉", "煮茶", "享静谧"],
    month: 11,
    dayRange: [22, 24],
    season: "winter",
  },
  {
    name: "大雪",
    poem: "大雪纷飞，万物潜藏。",
    actions: ["赏雪", "留白", "守宁静"],
    month: 12,
    dayRange: [6, 8],
    season: "winter",
  },
  {
    name: "冬至",
    poem: "极夜虽长，阳气初生。",
    actions: ["掌灯", "团圆", "待天明"],
    month: 12,
    dayRange: [21, 23],
    season: "winter",
  },
  {
    name: "小寒",
    poem: "寒气至极，岁暮天寒。",
    actions: ["蛰伏", "蓄力", "盼春归"],
    month: 1,
    dayRange: [5, 7],
    season: "winter",
  },
  {
    name: "大寒",
    poem: "岁末极寒，静待新春。",
    actions: ["除旧", "迎新", "满欢喜"],
    month: 1,
    dayRange: [19, 22],
    season: "winter",
  },
];

function getTodaySolarTerm(): SolarTerm | null {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  // 仅节气当天（dayRange[0]）显示卡片
  return (
    SOLAR_TERMS.find((t) => t.month === month && t.dayRange[0] === day) || null
  );
}

const USER_RESPONSES = [
  "这份温柔留在了今天的记忆里",
  "给自己一点时间的感觉，真的很棒",
  "认真对待小事的人，都值得被温柔对待",
  "今天的心变得很轻",
  "这份美好会留在今天的记忆里",
  "愿意停下来，就是对自己最好的照顾",
  "这份温暖正在慢慢散开",
  "给自己一点时间，世界会变得更柔软",
];

// ===== 类型定义 =====
type ViewMode = "main" | "monthly";

interface MemoryEntry {
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
}

// ===== 主组件 =====
function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [pageState, setPageState] = useState<"idle" | "revealed" | "done" | "collected">(
    "idle",
  );
  const [currentEvent, setCurrentEvent] = useState<GlowEvent | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(
    loadMemoryFromStorage(),
  );
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);
  const [orbFlash, setOrbFlash] = useState(false);
  const [showMemoryOptions, setShowMemoryOptions] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [pendingRecord, setPendingRecord] = useState<{
    imageData?: string;
    textContent?: string;
  } | null>(null);

  // ===== 拖拽 & 银河状态 =====
  const [isDragging, setIsDragging] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const orbContainerRef = useRef<HTMLDivElement | null>(null);
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef<{ y: number; time: number } | null>(null);
  const dragYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const season = useMemo(() => getSeason(), []);

  // 演示数据种子 —— 首次打开时预填历史记录方便预览时间轴
  useEffect(() => {
    const stored = localStorage.getItem("fuguang-memory");
    if (stored) return; // 已有数据就不种
    const today = new Date();
    const seed: MemoryEntry[] = [
      { id: 9001, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "08:30", emoji: "☀️", eventText: "拉开窗帘，让阳光慢慢洒进来。感受清晨的第一缕光落在皮肤上的温度。", keyword: "晨光", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "给自己一点时间的感觉，真的很棒" },
      { id: 9002, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "14:15", emoji: "☁️", eventText: "抬头看看今天的云吧。试着说说它像什么，像棉花糖还是像小猫？", keyword: "观云", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "这份温柔留在了今天的记忆里" },
      { id: 9003, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "19:40", emoji: "🍊", eventText: "剥一个橘子，慢慢吃。吃完后闻闻手上残留的清香，那是阳光的味道。", keyword: "剥橘", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "认真对待小事的人，都值得被温柔对待" },
      { id: 9004, date: `${today.getMonth()+1}月${today.getDate()-1}日`, month: today.getMonth()+1, time: "09:12", emoji: "🎵", eventText: "戴上耳机，听一首你很久没听的轻音乐。让旋律像水一样流过心里。", keyword: "听曲", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "今天的心变得很轻" },
      { id: 9005, date: `${today.getMonth()+1}月${today.getDate()-1}日`, month: today.getMonth()+1, time: "16:50", emoji: "🖍️", eventText: "拿一支笔，在纸上随意涂鸦五分钟。画什么都行，让手自由一点。", keyword: "涂鸦", moodId: "tired", moodLabel: "疲惫", moodColor: "#C8C888", response: "愿意停下来，就是对自己最好的照顾" },
      { id: 9006, date: `${today.getMonth()+1}月${today.getDate()-2}日`, month: today.getMonth()+1, time: "07:55", emoji: "🍞", eventText: "试着给自己准备一份早餐吧，哪怕只是一片吐司，慢慢咀嚼。", keyword: "慢食", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "这份美好会留在今天的记忆里" },
      { id: 9007, date: `${today.getMonth()+1}月${today.getDate()-2}日`, month: today.getMonth()+1, time: "21:10", emoji: "📖", eventText: "翻开一本书，读一段让你心动的句子。不用读完，只读一段就好。", keyword: "阅书", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "给自己一点时间，世界会变得更柔软" },
      { id: 9008, date: `${today.getMonth()+1}月${today.getDate()-3}日`, month: today.getMonth()+1, time: "11:30", emoji: "🌿", eventText: "试着给房间里的绿植浇一点水，和它们说声早安，它们会听见的。", keyword: "浇花", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "这份温暖正在慢慢散开" },
      { id: 9009, date: `${today.getMonth()+1}月${today.getDate()-3}日`, month: today.getMonth()+1, time: "17:25", emoji: "🍃", eventText: "如果愿意出门走走，试着找一片形状特别的叶子带回来。", keyword: "拾叶", moodId: "sad", moodLabel: "低落", moodColor: "#A4C4B8", response: "愿意停下来，就是对自己最好的照顾" },
      { id: 9010, date: `${today.getMonth()+1}月${today.getDate()-4}日`, month: today.getMonth()+1, time: "12:05", emoji: "💧", eventText: "手边的水杯空了吗？去接一杯温水，感受它缓缓流过喉咙的暖意吧。", keyword: "温水", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "认真对待小事的人，都值得被温柔对待" },
      { id: 9011, date: `${today.getMonth()+1}月${today.getDate()-4}日`, month: today.getMonth()+1, time: "20:30", emoji: "🌅", eventText: "找一个能看到天空的窗口，静静看日落。光线从金黄变成橘红再变成深蓝。", keyword: "看日落", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "这份温柔留在了今天的记忆里" },
      { id: 9012, date: `${today.getMonth()+1}月${today.getDate()-5}日`, month: today.getMonth()+1, time: "10:15", emoji: "📷", eventText: "拍下了窗台上开的第一朵花，花瓣上还挂着露水。", keyword: "拍照", moodId: "", moodLabel: "留念", moodColor: "#B8C8D8", response: "", imageData: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F5E6D3'/%3E%3Cstop offset='50%25' style='stop-color:%23E8D5C4'/%3E%3Cstop offset='100%25' style='stop-color:%23D4C8B8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='360' height='240' fill='url(%23g)'/%3E%3Ccircle cx='180' cy='100' r='30' fill='none' stroke='%23D4A5A5' stroke-width='1.5'/%3E%3Ctext x='180' y='165' text-anchor='middle' fill='%23B5A99E' font-size='13' font-family='serif'%3E📷 窗台的花%3C/text%3E%3C/svg%3E" },
      { id: 9013, date: `${today.getMonth()+1}月${today.getDate()-5}日`, month: today.getMonth()+1, time: "18:40", emoji: "☕", eventText: "给自己泡了一杯温热的蜂蜜水，捧在手心里慢慢喝。", keyword: "蜂蜜水", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "认真对待小事的人，都值得被温柔对待" },
      { id: 9014, date: `${today.getMonth()+1}月${today.getDate()-6}日`, month: today.getMonth()+1, time: "10:20", emoji: "🐦", eventText: "如果窗外有鸟叫声，要不要停下来听一听？数数有几种不同的旋律。", keyword: "听鸟", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "今天的心变得很轻" },
    ];
    localStorage.setItem("fuguang-memory", JSON.stringify(seed));
    setMemoryEntries(seed);
  }, []);

  // 四季音乐
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      const tracks = SEASON_MUSIC[season];
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      audioRef.current = new Audio();
      audioRef.current.src = randomTrack;
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
      audioRef.current.load();
    }
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.then(() => setIsMusicPlaying(true)).catch(() => {});
      }
    }
  }, [isMusicPlaying, season]);

  // ===== 清理拖拽计时器 =====
  useEffect(() => {
    return () => {
      if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    };
  }, []);

  // ===== 点击光球：抽取今日小事 =====
  const handleOrbClick = useCallback(() => {
    if (isAnimating || pageState !== "idle") return;
    setIsAnimating(true);
    const period = getCurrentPeriod();
    const suitableEvents = ALL_EVENTS.filter(
      (t) => t.period.includes(period) || t.period.includes("anytime"),
    );
    const randomEvent =
      suitableEvents[Math.floor(Math.random() * suitableEvents.length)];
    setTimeout(() => {
      setCurrentEvent(randomEvent);
      setPageState("revealed");
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, pageState]);

  // ===== 拖拽手势：长按 200ms 激活 =====
  const THRESHOLD_PX = typeof window !== "undefined" ? window.innerHeight * 0.2 : 120;

  const handleOrbPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (pageState !== "idle" || isAnimating) return;
      const y = e.clientY;
      dragStartRef.current = { y, time: Date.now() };
      setDragY(0);
      setIsDragging(false);
      setDragReady(false);

      // 200ms 后激活拖拽模式
      dragTimerRef.current = setTimeout(() => {
        setDragReady(true);
        setIsDragging(true);
        isDraggingRef.current = true;
        if (navigator.vibrate) navigator.vibrate(50);
      }, 200);
    },
    [pageState, isAnimating],
  );

  const handleOrbPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current) return;
      const dy = e.clientY - dragStartRef.current.y;
      // 没激活拖拽但移动太多 = 取消（防止误触）
      if (!dragReady && Math.abs(dy) > 8) {
        if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
        dragStartRef.current = null;
        return;
      }
      if (!isDraggingRef.current) return;

      // 只向下，加阻尼
      if (dy > 0) {
        dragYRef.current = dy;
        setDragY(dy);
      }
    },
    [dragReady],
  );

  const handleOrbPointerUp = useCallback(() => {
    if (dragTimerRef.current) clearTimeout(dragTimerRef.current);

    if (!isDraggingRef.current || !dragStartRef.current) {
      // 短按 → 点击
      const elapsed = Date.now() - (dragStartRef.current?.time ?? 0);
      if (elapsed < 200 && dragStartRef.current) {
        handleOrbClick();
      }
      dragStartRef.current = null;
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragReady(false);
      dragYRef.current = 0;
      setDragY(0);
      return;
    }

    // 拖拽释放判断阈值（用 ref 避免闭包陈旧值）
    const dy = dragYRef.current;
    if (dy >= THRESHOLD_PX) {
      setShowTimeline(true);
    }
    dragStartRef.current = null;
    setIsDragging(false);
    isDraggingRef.current = false;
    setDragReady(false);
    dragYRef.current = 0;
    setDragY(0);
  }, [handleOrbClick]);

  // ===== 感受当下：光球闪亮 → 浮现 📷/🏷️ =====
  const handleFeelNow = useCallback(() => {
    if (isAnimating || pageState !== "revealed") return;
    setIsAnimating(true);
    setOrbFlash(true);
    setTimeout(() => {
      setPageState("done");
      setShowMemoryOptions(true);
      setOrbFlash(false);
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, pageState]);

  // ===== 📷 留念：打开相机 =====
  const handlePhotoCapture = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handlePhotoTaken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !currentEvent) return;
      // 读取图片为 base64 缩略图
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setPendingRecord({ imageData });
        setShowMemoryOptions(false);
        setShowMoodPicker(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [currentEvent],
  );

  // ===== ✏️ 写一句：打开文本输入 =====
  const handleTextWrite = useCallback(() => {
    setShowMemoryOptions(false);
    setTextInputValue("");
    setShowTextInput(true);
  }, []);

  // ===== ✏️ 写一句 → 进情绪选择 =====
  const handleTextSave = useCallback(() => {
    const text = textInputValue.trim();
    if (!text || isAnimating) return;
    setShowTextInput(false);
    setPendingRecord({ textContent: text });
    setShowMoodPicker(true);
  }, [textInputValue, isAnimating]);

  // ===== 🏷️ 标记心情：弹出情绪选择 =====
  const handleMoodTag = useCallback(() => {
    setShowMemoryOptions(false);
    setShowMoodPicker(true);
  }, []);

  // ===== 选择情绪后保存（统一入口）=====
  const handleMoodSelect = useCallback(
    (mood: (typeof ALL_MOODS)[0]) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setShowMoodPicker(false);
      const randomWords =
        USER_RESPONSES[Math.floor(Math.random() * USER_RESPONSES.length)];
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
      const timeStr = getTimeStr();

      const pending = pendingRecord;
      setPendingRecord(null);

      let newEntry: MemoryEntry;
      if (pending?.textContent) {
        newEntry = {
          id: Date.now() + Math.random(),
          date: dateStr, month: now.getMonth() + 1, time: timeStr,
          emoji: "✏️",
          eventText: pending.textContent,
          keyword: pending.textContent.slice(0, 8),
          moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
          response: randomWords,
        };
      } else if (pending?.imageData) {
        newEntry = {
          id: Date.now() + Math.random(),
          date: dateStr, month: now.getMonth() + 1, time: timeStr,
          emoji: "📷",
          eventText: currentEvent?.text || "",
          keyword: currentEvent?.keyword || "留念",
          moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
          response: randomWords,
          imageData: pending.imageData,
        };
      } else if (currentEvent) {
        newEntry = {
          id: Date.now() + Math.random(),
          date: dateStr, month: now.getMonth() + 1, time: timeStr,
          emoji: currentEvent.emoji,
          eventText: currentEvent.text,
          keyword: currentEvent.keyword,
          moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
          response: randomWords,
        };
      } else {
        setIsAnimating(false);
        return;
      }

      setTimeout(() => {
        setResponseText(randomWords);
        setPageState("collected");
        setIsAnimating(false);
        setMemoryEntries((prev) => {
          const updated = [newEntry, ...prev];
          saveMemoryToStorage(updated);
          return updated;
        });
        // 2.5 秒后自动回到 idle
        setTimeout(() => {
          setResponseText("");
          setPageState("idle");
          setCurrentEvent(null);
        }, 2500);
      }, 800);
    },
    [isAnimating, currentEvent, pendingRecord],
  );

  // ===== 再拾一段：回到 idle =====
  const handleReset = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setResponseText("");
    setShowMemoryOptions(false);
    setPageState("idle");
    setCurrentEvent(null);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  // ===== 今日拾光页面 =====
  if (viewMode === "main") {
    return (
      <div className="fuguang-page">
        {/* 音乐按钮 */}
        <button
          className={`fuguang-music-btn ${isMusicPlaying ? "playing" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleMusic();
          }}
        >
          {isMusicPlaying ? "♪" : "♫"}
        </button>

        {/* 时光印记入口按钮 */}
        <button
          className="fuguang-timeline-nav"
          onClick={(e) => {
            e.stopPropagation();
            setShowTimeline(true);
          }}
        >
          📔
        </button>

        <div className="fuguang-header">
          <p className="fuguang-ganzhi">{getGanZhiDate()}</p>
          <h1 className="fuguang-title">今日拾光</h1>
        </div>

        <div className="fuguang-content">
          {/* 节气卡片 / 呼吸光球 */}
          {(() => {
            const term = getTodaySolarTerm();
            const showFlash = orbFlash;

            if (term) {
              const seasonColors: Record<string, string> = {
                spring: "#8CB4C4", summer: "#D87850", autumn: "#C8A860", winter: "#B8A8B0",
              };
              const c = seasonColors[term.season];
              return (
                <div
                  className={`fuguang-solar-term-card ${pageState === "idle" ? "fuguang-solar-term-card--tappable" : ""} ${isDragging ? "fuguang-solar-term-card--dragging" : ""}`}
                  style={{
                    borderColor: c + "35",
                    touchAction: isDragging ? "none" : "auto",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    transform: isDragging
                      ? `translateY(${dragY}px)`
                      : "translateY(0)",
                    transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => { if (pageState === "idle" && !isDragging) handleOrbClick(); }}
                  onPointerDown={handleOrbPointerDown}
                  onPointerMove={handleOrbPointerMove}
                  onPointerUp={handleOrbPointerUp}
                  onPointerCancel={handleOrbPointerUp}
                  onMouseDown={handleOrbPointerDown as unknown as React.MouseEventHandler}
                  onMouseMove={handleOrbPointerMove as unknown as React.MouseEventHandler}
                  onMouseUp={handleOrbPointerUp as unknown as React.MouseEventHandler}
                >
                  <div className="fuguang-solar-term-name" style={{ color: c }}>{term.name}</div>
                  <div className="fuguang-solar-term-poem">{term.poem}</div>
                  <div className="fuguang-solar-term-actions">
                    {term.actions.map((a, i) => (
                      <span key={i} className="fuguang-solar-term-dot" style={{ borderColor: c + "30" }}>{a}</span>
                    ))}
                  </div>
                  {pageState === "idle" && (
                    <p className="fuguang-orb-hint" style={{ position: "relative", bottom: "auto", marginTop: "10px" }}>轻触卡片 · 拾取今日</p>
                  )}
                  {pageState === "idle" && !isDragging && (
                    <span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`} style={{ position: "relative", bottom: "-4px" }}>
                      ↓ 继续下拉查看时光印记
                    </span>
                  )}
                  {isDragging && (
                    <span className="fuguang-orb-drag-hint visible" style={{ position: "relative", bottom: "-4px" }}>
                      {dragY >= THRESHOLD_PX ? "✧ 松手查看时光印记" : "↓ 继续下拉"}
                    </span>
                  )}
                </div>
              );
            }
            // 非节气日：显示呼吸光球（带拖拽手势）
            const orbClasses = [
              "fuguang-orb",
              pageState === "idle" && !dragReady && "fuguang-orb--idle",
              showFlash && "fuguang-orb--flash",
              dragReady && !isDragging && "fuguang-orb--drag-ready",
              isDragging && "fuguang-orb--dragging",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                ref={orbContainerRef}
                className={`fuguang-orb-area ${pageState === "idle" ? "fuguang-orb-area--tappable" : ""} ${isDragging ? "fuguang-orb-area--dragging" : ""}`}
                style={{
                  touchAction: isDragging ? "none" : "auto",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  transform: isDragging
                    ? `translateY(${dragY}px)`
                    : dragY === 0
                      ? "translateY(0)"
                      : undefined,
                  transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onPointerDown={handleOrbPointerDown}
                onPointerMove={handleOrbPointerMove}
                onPointerUp={handleOrbPointerUp}
                onPointerCancel={handleOrbPointerUp}
                onMouseDown={handleOrbPointerDown as unknown as React.MouseEventHandler}
                onMouseMove={handleOrbPointerMove as unknown as React.MouseEventHandler}
                onMouseUp={handleOrbPointerUp as unknown as React.MouseEventHandler}
              >
                <div className={orbClasses} />
                {pageState === "idle" && !isDragging && (
                  <>
                    <p className="fuguang-orb-hint">轻触光球 · 拾一段时光</p>
                    <span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`}>
                      ↓ 继续下拉查看时光印记
                    </span>
                  </>
                )}
                {isDragging && (
                  <span className="fuguang-orb-drag-hint visible">
                    {dragY >= THRESHOLD_PX ? "✧ 松手查看时光印记" : "↓ 继续下拉"}
                  </span>
                )}
              </div>
            );
          })()}

          {/* 事件卡片 */}
          {(pageState === "revealed" || pageState === "done") && currentEvent && (
            <div className="fuguang-reveal">
              <p className="fuguang-event-text">{currentEvent.text}</p>
            </div>
          )}

          {/* 感受当下 按钮 */}
          {pageState === "revealed" && currentEvent && (
            <button
              className="fuguang-feel-now-btn"
              onClick={(e) => { e.stopPropagation(); handleFeelNow(); }}
            >
              感受当下
            </button>
          )}

          {/* 留念 / 标记心情 选项 */}
          {pageState === "done" && showMemoryOptions && (
            <div className="fuguang-memory-options">
              <p className="fuguang-memory-prompt">想要记录下此刻的画面或心情吗？</p>
              <div className="fuguang-memory-btns">
                <button className="fuguang-memory-btn" onClick={handlePhotoCapture}>
                  <span className="fuguang-memory-icon">📷</span>
                  <span className="fuguang-memory-label">留念</span>
                </button>
                <button className="fuguang-memory-btn" onClick={handleMoodTag}>
                  <span className="fuguang-memory-icon">🏷️</span>
                  <span className="fuguang-memory-label">标记心情</span>
                </button>
                <button className="fuguang-memory-btn" onClick={handleTextWrite}>
                  <span className="fuguang-memory-icon">✏️</span>
                  <span className="fuguang-memory-label">写一句</span>
                </button>
              </div>
              {/* 隐藏相机 input */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handlePhotoTaken}
              />
            </div>
          )}

          {/* 收藏完成 */}
          {pageState === "collected" && currentEvent && (
            <div className="fuguang-collected">
              <p className="fuguang-response-text">「{responseText}」</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="fuguang-action-ghost mt-8"
              >
                再拾一段
              </button>
            </div>
          )}

        </div>

        {/* 写一句弹窗 */}
        {showTextInput && (
          <div className="fuguang-mood-overlay">
            <div className="fuguang-mood-backdrop" onClick={() => setShowTextInput(false)} />
            <div className="fuguang-mood-sheet">
              <p className="fuguang-mood-title">写下一句你想记住的</p>
              <textarea
                className="fuguang-text-input"
                placeholder="比如：今天路过面包店，闻到了小时候的味道..."
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="fuguang-text-input-btns">
                <button className="fuguang-text-input-cancel" onClick={() => setShowTextInput(false)}>
                  取消
                </button>
                <button
                  className="fuguang-text-input-save"
                  onClick={handleTextSave}
                  disabled={!textInputValue.trim() || isAnimating}
                >
                  存入时光
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 心情选择弹窗 */}
        {showMoodPicker && (
          <div className="fuguang-mood-overlay">
            <div
              className="fuguang-mood-backdrop"
              onClick={() => setShowMoodPicker(false)}
            />
            <div className="fuguang-mood-sheet">
              <p className="fuguang-mood-title">此刻的心情</p>
              <div className="fuguang-mood-options">
                {ALL_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoodSelect(mood);
                    }}
                    className="fuguang-mood-btn"
                  >
                    <div
                      className="fuguang-mood-circle"
                      style={{ backgroundColor: mood.color }}
                    >
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 朋友圈式时间轴（下拉打开） */}
        <AnimatePresence>
          {showTimeline && (
            <FuguangTimeline
              entries={memoryEntries}
              onClose={() => setShowTimeline(false)}
              onDelete={(id) => {
                setMemoryEntries((prev) => {
                  const updated = prev.filter((e) => e.id !== id);
                  saveMemoryToStorage(updated);
                  return updated;
                });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ===== 当月回顾页面（待后续实现） =====
  return (
    <div className="fuguang-page">
      <div className="fuguang-header">
        <p className="fuguang-ganzhi">{getGanZhiDate()}</p>
        <h1 className="fuguang-title">时光印记</h1>
      </div>
      <div className="fuguang-content">
        <p className="fuguang-placeholder">当月回顾</p>
      </div>
    </div>
  );
}

// ===== 工具函数 =====
function getPeriodGreeting(): string {
  const period = getCurrentPeriod();
  switch (period) {
    case "morning":
      return "早安，光在呼吸";
    case "afternoon":
      return "午后，光在游荡";
    case "evening":
      return "傍晚，光在沉淀";
    case "night":
      return "夜深，光在安眠";
    default:
      return "光在呼吸";
  }
}

function loadMemoryFromStorage(): MemoryEntry[] {
  try {
    const stored = localStorage.getItem("fuguang-memory");
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveMemoryToStorage(entries: MemoryEntry[]) {
  try {
    localStorage.setItem("fuguang-memory", JSON.stringify(entries));
  } catch {}
}

export default App;
