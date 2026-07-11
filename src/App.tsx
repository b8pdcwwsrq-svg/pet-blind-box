import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FuguangTimeline from "./components/FuguangTimeline";
<<<<<<< HEAD
import ShareCard from "./components/ShareCard";
import FragmentCard from "./components/FragmentCard";
import BoardEditor from "./components/BoardEditor";
import type { BoardElement } from "./components/BoardEditor";
import {
  ALL_EVENTS, ALL_MOODS, MemoryEntry, FragmentData,
  getCurrentPeriod, getTodaySolarTerm, getGanZhiDate,
  getSeason, getTimeStr,
  loadMemoryFromStorage, saveMemoryToStorage,
  getFragmentPool, getTodayFragmentWritten,
} from "./utils/memoryUtils";

const GH_AUDIO = "https://cdn.jsdelivr.net/gh/bradtraversy/ambient-sound-mixer@main/audio";
const SEASON_MUSIC: Record<string, string[]> = {
  spring: [`${GH_AUDIO}/birds.mp3`, `${GH_AUDIO}/wind.mp3`],
  summer: [`${GH_AUDIO}/rain.mp3`, `${GH_AUDIO}/ocean.mp3`],
  autumn: [`${GH_AUDIO}/wind.mp3`, `${GH_AUDIO}/night.mp3`],
  winter: [`${GH_AUDIO}/night.mp3`, `${GH_AUDIO}/fireplace.mp3`],
};

let audioInstance: HTMLAudioElement | null = null;

function App() {
  const [pageState, setPageState] = useState<"idle" | "loading" | "revealed" | "collected">("idle");
  const [currentEvent, setCurrentEvent] = useState<typeof ALL_EVENTS[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(loadMemoryFromStorage());
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [orbFlash, setOrbFlash] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [quoteCurrent, setQuoteCurrent] = useState(false);
  const pendingRef = useRef<{ title: string; compositeImage: string } | null>(null);
  const [shareCardData, setShareCardData] = useState<{ emoji: string; text: string; moodLabel: string; moodColor: string } | null>(null);
  const [showFragment, setShowFragment] = useState(false);
  const [currentFragment, setCurrentFragment] = useState<FragmentData | null>(null);
  const [fragmentKey, setFragmentKey] = useState(0);

  const [breathePhase, setBreathePhase] = useState(0);
  const breatheLabels = ["吸气…", "屏息…", "呼气…"];

  const [theme, setTheme] = useState(() => localStorage.getItem("fuguang-theme") || "default");
  const [showThemePicker, setShowThemePicker] = useState(false);
  useEffect(() => { document.body.setAttribute("data-theme", theme); localStorage.setItem("fuguang-theme", theme); }, [theme]);

  const THEMES = [
    { id: "default", label: "原色", color: "#f7f4ed", accent: "#D87850" },
    { id: "sakura", label: "春樱", color: "#FDF6F5", accent: "#E8A0B0" },
    { id: "ocean", label: "夏海", color: "#F0F4F8", accent: "#5A9AAA" },
    { id: "maple", label: "秋枫", color: "#F8F2E8", accent: "#C87040" },
    { id: "snow", label: "冬雪", color: "#F2F4F5", accent: "#7A8A9A" },
  ];

  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("fuguang-visited"));
  const [moodFeedbackMsg, setMoodFeedbackMsg] = useState("");

  const MOOD_FEEDBACK: Record<string, string[]> = {
    calm: ["平静很好，像水面一样。", "什么都不缺，这一刻就够了。"],
    warm: ["温暖的感觉，记住了。", "心里有光，哪怕是一点点。"],
    happy: ["开心是可以的，不用觉得不真实。", "这个瞬间值得被收藏。"],
    content: ["满足不是终点，是路上的风景。", "这样就很好，不需要更多。"],
    sad: ["低落也是可以的，让它待一会儿。", "不一定要好起来，先待在这里。"],
    tired: ["累了就是累了，不需要理由。", "休息不是偷懒，是在积蓄。"],
    confused: ["你不需要知道答案。迷路也是路的一部分。", "找不到方向时，停下来听听自己的声音。"],
  };

=======

// ===== 拾光事件数据 =====
interface GlowEvent {
  id: number;
  emoji: string;
  text: string;
  keyword: string;
  period: string[];
  location: string;
}

const ALL_EVENTS: GlowEvent[] = [
  // === 晨间 ===
  { id: 1, emoji: "☀️", text: "试着拉开窗帘，让阳光慢慢洒进来。感受清晨的第一缕光落在皮肤上的温度。", keyword: "晨光", period: ["morning"], location: "窗边" },
  { id: 2, emoji: "🍞", text: "给自己准备一份早餐吧，哪怕只是一片吐司，慢慢咀嚼，感受食物本来的味道。", keyword: "慢食", period: ["morning"], location: "厨房" },
  { id: 3, emoji: "🐦", text: "如果窗外有鸟叫声，停下来听一听。数数有几种不同的旋律。", keyword: "听鸟", period: ["morning"], location: "窗边" },
  { id: 4, emoji: "💧", text: "手边的水杯空了吗？去接一杯温水，感受它缓缓流过喉咙的暖意。", keyword: "温水", period: ["morning", "afternoon", "evening"], location: "桌边" },
  { id: 5, emoji: "🌿", text: "给房间里的绿植浇一点水，和它们说声早安，它们会听见的。", keyword: "浇花", period: ["morning"], location: "阳台" },
  { id: 6, emoji: "🌤️", text: "拍一张今天早上的天空吧，记录下此刻独一无二的光线。", keyword: "天光", period: ["morning"], location: "窗边" },
  { id: 7, emoji: "🪴", text: "摸摸手边最近的那片叶子，感觉它的纹理。它在安静地呼吸着。", keyword: "触叶", period: ["morning", "afternoon"], location: "阳台" },
  { id: 8, emoji: "🪞", text: "洗脸的时候看看镜子里的自己，对镜子里的人点一下头。早上好。", keyword: "镜中", period: ["morning"], location: "洗手间" },

  // === 午间 ===
  { id: 9, emoji: "☁️", text: "如果眼睛累了，抬头看看今天的云。说说它像什么，像棉花糖还是像小猫？", keyword: "观云", period: ["morning", "afternoon"], location: "窗边" },
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
  { id: 19, emoji: "🌳", text: "走到最近的树下站一会儿，仰头看看叶子缝隙间的光。树已经站了很久了。", keyword: "树下", period: ["morning", "afternoon"], location: "公园" },
  { id: 20, emoji: "🚶", text: "散十分钟步，不用走多远。走慢一点，感觉脚底和地面的每一次接触。", keyword: "慢走", period: ["morning", "afternoon", "evening"], location: "马路" },
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
  { id: 36, emoji: "🌟", text: "关掉灯，在黑暗中看三分钟手机屏幕外的世界。黑暗里藏着很多安静的声音。", keyword: "熄灯", period: ["night"], location: "卧室" },
  { id: 37, emoji: "🛏️", text: "整理一下枕头和被子，给自己搭一个舒服的睡觉角落，像搭一个小窝。", keyword: "理榻", period: ["evening", "night"], location: "卧室" },
  { id: 38, emoji: "🎧", text: "睡前听一首很慢的歌。闭上眼睛只听歌，什么都不想。", keyword: "入眠", period: ["night"], location: "床上" },
  { id: 39, emoji: "🌈", text: "想想今天有没有什么让人微笑的瞬间？哪怕只是嘴角轻轻上扬了一下。", keyword: "回味", period: ["evening", "night"], location: "床上" },

  // === 随时 ===
  { id: 40, emoji: "🌸", text: "在房间里找一个喜欢的小物件，拿在手里好好看看它。是什么让人喜欢？", keyword: "拾物", period: ["anytime"], location: "房间" },
  { id: 41, emoji: "🎨", text: "拿出彩笔，画一个今天看到的颜色。不用画得像，画出感觉就好。", keyword: "绘色", period: ["anytime"], location: "桌边" },
  { id: 42, emoji: "📸", text: "在房间里找一个角落，拍一张照片。最普通的角落也有好看的角度。", keyword: "寻角", period: ["anytime"], location: "房间" },
  { id: 43, emoji: "🗂️", text: "整理一个抽屉、一个文件夹或者手机里的十张截图。只整理一下就好。", keyword: "小整", period: ["anytime"], location: "桌边" },
  { id: 44, emoji: "🫳", text: "摸一摸身边最近的布料——沙发的、抱枕的、窗帘的。感受它的纹理。", keyword: "触物", period: ["anytime"], location: "沙发" },
  { id: 45, emoji: "🪑", text: "换一个不常坐的位置坐一会儿。从不同的角度看同一个房间。", keyword: "换位", period: ["anytime"], location: "房间" },
  { id: 46, emoji: "📻", text: "打开收音机或者播客，随机听一个台。听听陌生人在说什么。", keyword: "随听", period: ["anytime"], location: "沙发" },
  { id: 47, emoji: "🧶", text: "找一根线或者一根头绳，编一个最简单的结。手指在做重复动作的时候，脑子会安静下来。", keyword: "编结", period: ["anytime"], location: "桌边" },
  { id: 48, emoji: "🥛", text: "倒一杯凉白开，小口小口地喝。凉白开是最好喝的饮料之一。", keyword: "喝水", period: ["anytime"], location: "桌边" },
  { id: 49, emoji: "🕰️", text: "停下来一分钟，什么都不做。就是坐着或者站着，呼吸，等这一分钟过去。", keyword: "止时", period: ["anytime"], location: "任何地方" },
  { id: 50, emoji: "🍂", text: "找一个干燥的、会响的东西——纸、树叶、塑料袋——用手指轻轻捏一下，听它发出的声音。", keyword: "听物", period: ["anytime"], location: "桌边" },
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
  { id: "happy", label: "开心", color: "#E8B878" },
  { id: "sad", label: "低落", color: "#A4C4B8" },
  { id: "tired", label: "疲惫", color: "#C8C888" },
  { id: "confused", label: "困惑", color: "#B8A0C8" },
  { id: "content", label: "满足", color: "#C4B888" },
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
  location: string;
}

// ===== 主组件 =====
function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [pageState, setPageState] = useState<"idle" | "loading" | "revealed" | "collected">(
    "idle",
  );
  const [currentEvent, setCurrentEvent] = useState<GlowEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(
    loadMemoryFromStorage(),
  );
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);
  const [orbFlash, setOrbFlash] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeTitle, setEnvelopeTitle] = useState("");
  const [envelopeText, setEnvelopeText] = useState("");
  const [envelopeImage, setEnvelopeImage] = useState<string | null>(null);

  // ===== 拖拽 & 银河状态 =====
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
  const [isDragging, setIsDragging] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

<<<<<<< HEAD
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
=======
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const orbContainerRef = useRef<HTMLDivElement | null>(null);
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef<{ y: number; time: number } | null>(null);
  const dragYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const season = useMemo(() => getSeason(), []);

<<<<<<< HEAD
  useEffect(() => { const i = setInterval(() => setBreathePhase(p => (p + 1) % 3), 4000); return () => clearInterval(i); }, []);
  const handleCloseWelcome = useCallback(() => { setShowWelcome(false); localStorage.setItem("fuguang-visited", "true"); }, []);
  useEffect(() => { if (!moodFeedbackMsg) return; const t = setTimeout(() => setMoodFeedbackMsg(""), 3000); return () => clearTimeout(t); }, [moodFeedbackMsg]);
  useEffect(() => { return () => { if (dragTimerRef.current) clearTimeout(dragTimerRef.current); }; }, []);

  const handleOrbClick = useCallback(() => {
    if (isAnimating) return;
    if (pageState !== "idle" && pageState !== "revealed") return;
=======
  // 演示数据种子 —— 首次打开时预填历史记录方便预览时间轴
  useEffect(() => {
    const stored = localStorage.getItem("fuguang-memory");
    if (stored) return; // 已有数据就不种
    const today = new Date();
    const seed: MemoryEntry[] = [
      { id: 9001, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "08:30", emoji: "☀️", eventText: "拉开窗帘，让阳光慢慢洒进来。感受清晨的第一缕光落在皮肤上的温度。", keyword: "晨光", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "", location: "窗边" },
      { id: 9002, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "14:15", emoji: "☁️", eventText: "抬头看看今天的云吧。试着说说它像什么，像棉花糖还是像小猫？", keyword: "观云", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "窗边" },
      { id: 9003, date: `${today.getMonth()+1}月${today.getDate()}日`, month: today.getMonth()+1, time: "19:40", emoji: "🍊", eventText: "剥一个橘子，慢慢吃。吃完后闻闻手上残留的清香，那是阳光的味道。", keyword: "剥橘", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "", location: "桌边" },
      { id: 9004, date: `${today.getMonth()+1}月${today.getDate()-1}日`, month: today.getMonth()+1, time: "09:12", emoji: "🎵", eventText: "戴上耳机，听一首很久没听的轻音乐。让旋律像水一样流过心里。", keyword: "听曲", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "沙发" },
      { id: 9005, date: `${today.getMonth()+1}月${today.getDate()-1}日`, month: today.getMonth()+1, time: "16:50", emoji: "🖍️", eventText: "拿一支笔，在纸上随意涂鸦五分钟。画什么都行，让手自由一点。", keyword: "涂鸦", moodId: "tired", moodLabel: "疲惫", moodColor: "#C8C888", response: "", location: "桌边" },
      { id: 9006, date: `${today.getMonth()+1}月${today.getDate()-2}日`, month: today.getMonth()+1, time: "07:55", emoji: "🍞", eventText: "试着给自己准备一份早餐吧，哪怕只是一片吐司，慢慢咀嚼。", keyword: "慢食", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "", location: "厨房" },
      { id: 9007, date: `${today.getMonth()+1}月${today.getDate()-2}日`, month: today.getMonth()+1, time: "21:10", emoji: "📖", eventText: "翻开一本书，读一段心动的句子。不用读完，只读一段就好。", keyword: "阅书", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "沙发" },
      { id: 9008, date: `${today.getMonth()+1}月${today.getDate()-3}日`, month: today.getMonth()+1, time: "11:30", emoji: "🌿", eventText: "试着给房间里的绿植浇一点水，和它们说声早安，它们会听见的。", keyword: "浇花", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "", location: "阳台" },
      { id: 9009, date: `${today.getMonth()+1}月${today.getDate()-3}日`, month: today.getMonth()+1, time: "17:25", emoji: "🍃", eventText: "如果愿意出门走走，试着找一片形状特别的叶子带回来。", keyword: "拾叶", moodId: "sad", moodLabel: "低落", moodColor: "#A4C4B8", response: "", location: "公园" },
      { id: 9010, date: `${today.getMonth()+1}月${today.getDate()-4}日`, month: today.getMonth()+1, time: "12:05", emoji: "💧", eventText: "手边的水杯空了吗？去接一杯温水，感受它缓缓流过喉咙的暖意吧。", keyword: "温水", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "桌边" },
      { id: 9011, date: `${today.getMonth()+1}月${today.getDate()-4}日`, month: today.getMonth()+1, time: "20:30", emoji: "🌅", eventText: "找一个能看到天空的窗口，静静看日落。光线从金黄变成橘红再变成深蓝。", keyword: "看日落", moodId: "warm", moodLabel: "温暖", moodColor: "#D4A4A8", response: "", location: "窗边" },
      { id: 9012, date: `${today.getMonth()+1}月${today.getDate()-5}日`, month: today.getMonth()+1, time: "10:15", emoji: "📷", eventText: "拍下了窗台上开的第一朵花，花瓣上还挂着露水。", keyword: "拍照", moodId: "", moodLabel: "留念", moodColor: "#B8C8D8", response: "", location: "阳台", imageData: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F5E6D3'/%3E%3Cstop offset='50%25' style='stop-color:%23E8D5C4'/%3E%3Cstop offset='100%25' style='stop-color:%23D4C8B8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='360' height='240' fill='url(%23g)'/%3E%3Ccircle cx='180' cy='100' r='30' fill='none' stroke='%23D4A5A5' stroke-width='1.5'/%3E%3Ctext x='180' y='165' text-anchor='middle' fill='%23B5A99E' font-size='13' font-family='serif'%3E📷 窗台的花%3C/text%3E%3C/svg%3E" },
      { id: 9013, date: `${today.getMonth()+1}月${today.getDate()-5}日`, month: today.getMonth()+1, time: "18:40", emoji: "☕", eventText: "给自己泡了一杯温热的蜂蜜水，捧在手心里慢慢喝。", keyword: "蜂蜜水", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "桌边" },
      { id: 9014, date: `${today.getMonth()+1}月${today.getDate()-6}日`, month: today.getMonth()+1, time: "10:20", emoji: "🐦", eventText: "如果窗外有鸟叫声，要不要停下来听一听？数数有几种不同的旋律。", keyword: "听鸟", moodId: "calm", moodLabel: "平静", moodColor: "#8CB4C4", response: "", location: "窗边" },
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

  // ===== 点击光球/卡片：idle抽取 或 revealed换一条 =====
  const handleOrbClick = useCallback(() => {
    if (isAnimating) return;
    if (pageState === "revealed") { handleSwap(); return; }
    if (pageState !== "idle") return;
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
    setIsAnimating(true);
    setPageState("loading");
    setCurrentEvent(null);
    const period = getCurrentPeriod();
<<<<<<< HEAD
    const suitableEvents = ALL_EVENTS.filter((t) => t.period.includes(period) || t.period.includes("anytime"));
    const randomEvent = suitableEvents[Math.floor(Math.random() * suitableEvents.length)];
    setTimeout(() => { setCurrentEvent(randomEvent); setPageState("revealed"); setIsAnimating(false); }, 700);
  }, [isAnimating, pageState]);

  const toggleMusic = useCallback(() => {
    if (!audioInstance) {
      const tracks = SEASON_MUSIC[season];
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      audioInstance = new Audio(track);
      audioInstance.loop = true;
      audioInstance.volume = 0.25;
      audioInstance.addEventListener("error", () => { console.warn("Audio failed to load"); audioInstance = null; setIsMusicPlaying(false); });
    }
    if (isMusicPlaying) { audioInstance.pause(); setIsMusicPlaying(false); }
    else { const pp = audioInstance.play(); if (pp) pp.then(() => setIsMusicPlaying(true)).catch(() => {}); }
  }, [isMusicPlaying, season]);

  const THRESHOLD_PX = typeof window !== "undefined" ? window.innerHeight * 0.2 : 120;
  const handleOrbPointerDown = useCallback((e: React.PointerEvent) => {
    if (pageState !== "idle" || isAnimating) return;
    dragStartRef.current = { y: e.clientY, time: Date.now() };
    setDragY(0); setIsDragging(false); setDragReady(false);
    dragTimerRef.current = setTimeout(() => { setDragReady(true); setIsDragging(true); isDraggingRef.current = true; if (navigator.vibrate) navigator.vibrate(50); }, 200);
  }, [pageState, isAnimating]);
  const handleOrbPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dy = e.clientY - dragStartRef.current.y;
    if (!dragReady && Math.abs(dy) > 8) { if (dragTimerRef.current) clearTimeout(dragTimerRef.current); dragStartRef.current = null; return; }
    if (!isDraggingRef.current) return;
    if (dy > 0) { dragYRef.current = dy; setDragY(dy); }
  }, [dragReady]);
  const handleOrbPointerUp = useCallback(() => {
    if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    if (!isDraggingRef.current || !dragStartRef.current) { dragStartRef.current = null; setIsDragging(false); isDraggingRef.current = false; setDragReady(false); dragYRef.current = 0; setDragY(0); return; }
    if (dragYRef.current >= THRESHOLD_PX) setShowTimeline(true);
    dragStartRef.current = null; setIsDragging(false); isDraggingRef.current = false; setDragReady(false); dragYRef.current = 0; setDragY(0);
  }, []);

  const handleRecordNow = useCallback(() => {
    if (isAnimating) return;
    setQuoteCurrent(false);
    setShowEnvelope(true);
  }, [isAnimating]);

  // BoardEditor 保存回调
  const handleBoardSave = useCallback((title: string, compositeImage: string) => {
    pendingRef.current = { title, compositeImage };
    setShowEnvelope(false);
    setShowMoodPicker(true);
  }, []);

  const handleMoodSelect = useCallback((mood: typeof ALL_MOODS[0]) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowMoodPicker(false);
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    const timeStr = getTimeStr();
    const p = pendingRef.current;
    const title = p ? p.title : "";
    const compositeImage = p ? p.compositeImage : "";
    pendingRef.current = null;
    if (title || compositeImage) {
      const emoji = "📷";
      const keyword = title || "手账";
      const newEntry: MemoryEntry = {
        id: Date.now() + Math.random(),
        date: dateStr, month: now.getMonth() + 1, time: timeStr,
        emoji, eventText: "", keyword,
        moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
        response: "", imageData: compositeImage || undefined,
        location: "房间",
      };
      setTimeout(() => {
        setPageState("collected"); setIsAnimating(false);
        setMemoryEntries(prev => { const u = [newEntry, ...prev]; saveMemoryToStorage(u); return u; });
        setTimeout(() => { setPageState("idle"); setCurrentEvent(null); setDragY(0); setIsDragging(false); setDragReady(false); isDraggingRef.current = false; dragYRef.current = 0; }, 2500);
      }, 600);
      return;
    }
    if (!currentEvent) { setIsAnimating(false); return; }
    const entry: MemoryEntry = {
      id: Date.now() + Math.random(),
      date: dateStr, month: now.getMonth() + 1, time: timeStr,
      emoji: currentEvent.emoji, eventText: currentEvent.text,
      keyword: currentEvent.keyword,
      moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
      response: "", location: currentEvent.location,
    };
    setTimeout(() => {
      setPageState("collected"); setIsAnimating(false);
      setMemoryEntries(prev => { const u = [entry, ...prev]; saveMemoryToStorage(u); return u; });
      setTimeout(() => { setPageState("idle"); setCurrentEvent(null); setDragY(0); setIsDragging(false); setDragReady(false); isDraggingRef.current = false; dragYRef.current = 0; }, 2500);
    }, 600);
  }, [isAnimating, currentEvent]);

  const handleTimelineShare = useCallback((entry: MemoryEntry) => {
    const data = { emoji: entry.emoji, text: entry.eventText || entry.keyword, moodLabel: entry.moodLabel, moodColor: entry.moodColor, imageData: entry.imageData };
    setShareCardData(data);
  }, []);
  const handleCloseShareCard = useCallback(() => setShareCardData(null), []);
  const handleReset = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true); setShowEnvelope(false);
    setPageState("idle"); setCurrentEvent(null);
    setDragY(0); setIsDragging(false); setDragReady(false);
    isDraggingRef.current = false; dragYRef.current = 0;
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  return (
    <div className="fuguang-page">
      <button className={`fuguang-music-btn ${isMusicPlaying ? "playing" : ""}`} onClick={(e) => { e.stopPropagation(); toggleMusic(); }}>{isMusicPlaying ? "♪" : "♫"}</button>
      <button className="fuguang-theme-btn" onClick={(e) => { e.stopPropagation(); setShowThemePicker(!showThemePicker); }}>🎨</button>
      <button className="fuguang-timeline-nav" onClick={(e) => { e.stopPropagation(); setShowTimeline(true); }}>📔</button>

      <div className="fuguang-header">
        <p className="fuguang-ganzhi">{(() => { const now = new Date(); const term = getTodaySolarTerm(); return term ? `✦ ${term.name} ✦` : `${now.getMonth() + 1}月${now.getDate()}日`; })()}</p>
        <h1 className="fuguang-title">今日拾光</h1>
      </div>

      {showWelcome && (
        <div className="fuguang-welcome-overlay">
          <div className="fuguang-welcome-card">
            <p className="fuguang-welcome-emoji">🫧</p>
            <p className="fuguang-welcome-line">不需要好起来</p>
            <p className="fuguang-welcome-line">只需要感觉到</p>
            <p className="fuguang-welcome-desc">每一天，从这里开始<br />做一件小事，觉察自己的情绪<br />低落也可以，不需要"好起来"</p>
            <p className="fuguang-welcome-footer">人生嘛，重在体验</p>
            <button className="fuguang-welcome-btn" onClick={handleCloseWelcome}>开始</button>
          </div>
        </div>
      )}

      {moodFeedbackMsg && <div className="fuguang-mood-toast">{moodFeedbackMsg}</div>}

      <div className="fuguang-content">
        {/* 节气卡片 / 光球 */}
        {(() => {
          const term = getTodaySolarTerm();
          if (term) {
            const seasonC: Record<string, string> = { spring: "#8CB4C4", summer: "#D87850", autumn: "#C8A860", winter: "#B8A8B0" };
            const c = seasonC[term.season];
            return (
              <div className={`fuguang-solar-term-card ${pageState === "idle" ? "fuguang-solar-term-card--tappable" : ""} ${isDragging ? "fuguang-solar-term-card--dragging" : ""}`}
                style={{ borderColor: c + "35", touchAction: isDragging ? "none" : "auto", userSelect: "none", transform: isDragging ? `translateY(${dragY}px)` : "translateY(0)", transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                onClick={() => { if ((pageState === "idle" || pageState === "revealed") && !isAnimating) handleOrbClick(); }}
                onPointerDown={handleOrbPointerDown} onPointerMove={handleOrbPointerMove}
                onPointerUp={handleOrbPointerUp} onPointerCancel={handleOrbPointerUp}>
                <div className="fuguang-solar-term-name" style={{ color: c }}>{term.name}</div>
                <div className="fuguang-solar-term-poem">{term.poem}</div>
                <div className="fuguang-solar-term-actions">{term.actions.map((a, i) => <span key={i} className="fuguang-solar-term-dot" style={{ borderColor: c + "30" }}>{a}</span>)}</div>
                {pageState === "idle" && <p className="fuguang-orb-hint" style={{ position: "relative", bottom: "auto", marginTop: "10px" }}>轻触卡片 · 拾取今日</p>}
                {pageState === "idle" && !isDragging && <span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`} style={{ position: "relative", bottom: "-4px" }}>↓ 继续下拉查看时光印记</span>}
              </div>
            );
          }
          const orbClasses = ["fuguang-orb", pageState === "idle" && !dragReady && "fuguang-orb--idle", orbFlash && "fuguang-orb--flash", dragReady && !isDragging && "fuguang-orb--drag-ready", isDragging && "fuguang-orb--dragging"].filter(Boolean).join(" ");
          return (
            <div className={`fuguang-orb-area ${pageState === "idle" ? "fuguang-orb-area--tappable" : ""} ${isDragging ? "fuguang-orb-area--dragging" : ""}`}
              style={{ touchAction: isDragging ? "none" : "auto", userSelect: "none", transform: isDragging ? `translateY(${dragY}px)` : "translateY(0)", transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
              onClick={() => { if ((pageState === "idle" || pageState === "revealed") && !isAnimating) handleOrbClick(); }}
              onPointerDown={handleOrbPointerDown} onPointerMove={handleOrbPointerMove}
              onPointerUp={handleOrbPointerUp} onPointerCancel={handleOrbPointerUp}>
              <div className={orbClasses} />
              {pageState === "idle" && !isDragging && (<><p className="fuguang-orb-hint">点一下，做一件小事</p><p className="fuguang-orb-breathe-hint">{breatheLabels[breathePhase]}</p><span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`}>↓ 继续下拉查看时光印记</span></>)}
              {isDragging && <span className="fuguang-orb-drag-hint visible">{dragY >= THRESHOLD_PX ? "✧ 松手查看时光印记" : "↓ 继续下拉"}</span>}
            </div>
          );
        })()}

        {pageState === "loading" && (
          <div className="fuguang-loading">
            <div className="fuguang-loading-dots"><span className="fuguang-loading-dot" style={{ animationDelay: "0s" }} /><span className="fuguang-loading-dot" style={{ animationDelay: "0.2s" }} /><span className="fuguang-loading-dot" style={{ animationDelay: "0.4s" }} /></div>
            <p className="fuguang-loading-text">正在寻找一段适合的时光...</p>
          </div>
        )}

        {pageState === "revealed" && currentEvent && <div className="fuguang-reveal"><p className="fuguang-event-text" key={currentEvent.id}>{currentEvent.text}</p></div>}
        {pageState === "revealed" && currentEvent && <div className="fuguang-reveal-btns"><button className="fuguang-record-now-btn" onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}>记录当下</button></div>}
        {pageState === "revealed" && <p className="fuguang-swap-hint">再次点击光球或卡片可以换一条</p>}

        {pageState === "idle" && (
          <div className="fuguang-record-now-wrap">
            <button className="fuguang-record-now-btn" onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}>记录当下</button>
            <button className={`fuguang-fragment-btn ${getTodayFragmentWritten() ? "done" : ""}`}
              onClick={(e) => { e.stopPropagation(); const pool = getFragmentPool(); const random = pool[Math.floor(Math.random() * pool.length)]; setCurrentFragment(random); setFragmentKey((k) => k + 1); setShowFragment(true); }}
              title="拾一片碎片">🪶</button>
          </div>
        )}

        {pageState === "idle" && <p className="fuguang-footer-quote">不需要好起来，只需要感觉到</p>}

        {/* BoardEditor 替代原来的信纸 */}
        {showEnvelope && (
          <BoardEditor
            onSave={handleBoardSave}
            onClose={() => setShowEnvelope(false)}
          />
        )}

        {/* 碎片卡片 */}
        {showFragment && currentFragment && (
          <FragmentCard key={fragmentKey} fragment={currentFragment}
            onClose={() => setShowFragment(false)}
            onFragmentWritten={() => { setFragmentKey((k) => k + 1); }}
          />
        )}

        {pageState === "collected" && (
          <div className="fuguang-collected">
            <p className="fuguang-response-text">已存入时光印记</p>
            <p className="fuguang-collected-count">你今天积累了 {memoryEntries.length} 个情绪时刻</p>
            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="fuguang-action-ghost">再拾一段</button>
          </div>
        )}
      </div>

      {/* 心情选择 */}
      {showMoodPicker && (
        <div className="fuguang-mood-overlay">
          <div className="fuguang-mood-backdrop" onClick={() => setShowMoodPicker(false)} />
          <div className="fuguang-mood-sheet">
            <p className="fuguang-mood-title">做完这件事，你感觉怎样？</p>
            <div className="fuguang-mood-options">
              {ALL_MOODS.map((mood) => (
                <button key={mood.id} className="fuguang-mood-btn"
                  onClick={(e) => { e.stopPropagation(); const msgs = MOOD_FEEDBACK[mood.id]; if (msgs) setMoodFeedbackMsg(msgs[Math.floor(Math.random() * msgs.length)]); handleMoodSelect(mood); }}>
                  <div className="fuguang-mood-circle" style={{ backgroundColor: mood.color }}>{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showTimeline && (
          <FuguangTimeline
            entries={memoryEntries}
            onClose={() => setShowTimeline(false)}
            onDelete={(id) => { setMemoryEntries(prev => { const u = prev.filter((e) => e.id !== id); saveMemoryToStorage(u); return u; }); }}
            onShare={handleTimelineShare}
          />
        )}
      </AnimatePresence>

      {shareCardData && <ShareCard data={shareCardData} onClose={handleCloseShareCard} />}
=======
    const suitableEvents = ALL_EVENTS.filter(
      (t) => t.period.includes(period) || t.period.includes("anytime"),
    );
    const randomEvent =
      suitableEvents[Math.floor(Math.random() * suitableEvents.length)];
    setTimeout(() => {
      setCurrentEvent(randomEvent);
      setPageState("revealed");
      setIsAnimating(false);
    }, 900);
  }, [isAnimating, pageState]);

  // ===== 在revealed状态点击光球/卡片 → 换一条小事 =====
  const handleSwap = useCallback(() => {
    if (isAnimating || pageState !== "revealed") return;
    setIsAnimating(true);
    setPageState("loading");
    setCurrentEvent(null);
    const others = ALL_EVENTS.filter((t) => t.id !== currentEvent?.id);
    const newTask = others[Math.floor(Math.random() * others.length)];
    setTimeout(() => {
      setCurrentEvent(newTask);
      setPageState("revealed");
      setIsAnimating(false);
    }, 700);
  }, [isAnimating, pageState, currentEvent]);

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

  // ===== 记录当下：打开信封 =====
  const handleRecordNow = useCallback(() => {
    if (isAnimating) return;
    setEnvelopeTitle("");
    setEnvelopeText("");
    setEnvelopeImage(null);
    setShowEnvelope(true);
  }, [isAnimating]);

  // ===== 信封内拍照 =====
  const handleEnvelopePhoto = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handlePhotoTaken = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEnvelopeImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  // ===== 信封提交 → 选情绪 =====
  const handleEnvelopeSubmit = useCallback(() => {
    const title = envelopeTitle.trim();
    const text = envelopeText.trim();
    if (!title && !text && !envelopeImage) return;
    setShowEnvelope(false);
    setShowMoodPicker(true);
  }, [envelopeTitle, envelopeText, envelopeImage]);

  // ===== 标记心情：光球抽取后 → 选情绪 → 保存 =====
  const handleMoodTag = useCallback(() => {
    setShowMoodPicker(true);
  }, []);

  const handleMoodSelect = useCallback(
    (mood: (typeof ALL_MOODS)[0]) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setShowMoodPicker(false);
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
      const timeStr = getTimeStr();

      // 从信封来的：文字+照片+情绪
      const title = envelopeTitle.trim();
      const body = envelopeText.trim();
      if (title || body || envelopeImage) {
        const emoji = envelopeImage ? "📷" : "✏️";
        // 关键词：标题优先，无标题取正文前8字，都没有用留影
        const k = title || body.slice(0, 8);
        // 正文：只有写了正文才显示，避免和关键词重复
        const t = body && body !== k ? body : "";
        if (!t && !k && !envelopeImage) return;
        const keyword = k || "留影";
        const eventText = t || "";
        const newEntry: MemoryEntry = {
          id: Date.now() + Math.random(),
          date: dateStr, month: now.getMonth() + 1, time: timeStr,
          emoji,
          eventText,
          keyword,
          moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
          response: "",
          imageData: envelopeImage || undefined,
          location: "房间",
        };
        setEnvelopeTitle("");
        setEnvelopeText("");
        setEnvelopeImage(null);
        setTimeout(() => {
          setPageState("collected");
          setIsAnimating(false);
          setMemoryEntries((prev) => {
            const updated = [newEntry, ...prev];
            saveMemoryToStorage(updated);
            return updated;
          });
          setTimeout(() => {
            setPageState("idle");
            setCurrentEvent(null);
          }, 2500);
        }, 600);
        return;
      }

      // 从光球来的：只有情绪色
      if (!currentEvent) { setIsAnimating(false); return; }
      const newEntry: MemoryEntry = {
        id: Date.now() + Math.random(),
        date: dateStr, month: now.getMonth() + 1, time: timeStr,
        emoji: currentEvent.emoji,
        eventText: currentEvent.text,
        keyword: currentEvent.keyword,
        moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
        response: "",
        location: currentEvent.location,
      };
      setTimeout(() => {
        setPageState("collected");
        setIsAnimating(false);
        setMemoryEntries((prev) => {
          const updated = [newEntry, ...prev];
          saveMemoryToStorage(updated);
          return updated;
        });
        setTimeout(() => {
          setPageState("idle");
          setCurrentEvent(null);
        }, 2500);
      }, 600);
    },
    [isAnimating, currentEvent, envelopeTitle, envelopeText, envelopeImage],
  );

  // ===== 再拾一段：回到 idle =====
  const handleReset = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowEnvelope(false);
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
                  onClick={() => { if ((pageState === "idle" || pageState === "revealed") && !isDragging) handleOrbClick(); }}
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

          {/* 加载动画 */}
          {pageState === "loading" && (
            <div className="fuguang-loading">
              <div className="fuguang-loading-dots">
                <span className="fuguang-loading-dot" style={{ animationDelay: "0s" }} />
                <span className="fuguang-loading-dot" style={{ animationDelay: "0.2s" }} />
                <span className="fuguang-loading-dot" style={{ animationDelay: "0.4s" }} />
              </div>
              <p className="fuguang-loading-text">正在寻找一段适合的时光...</p>
            </div>
          )}

          {/* 事件卡片 */}
          {pageState === "revealed" && currentEvent && (
            <div className="fuguang-reveal">
              <p className="fuguang-event-text" key={currentEvent.id}>{currentEvent.text}</p>
            </div>
          )}

          {/* 光球抽取后：标记心情 / 记录当下 */}
          {pageState === "revealed" && currentEvent && (
            <div className="fuguang-reveal-btns">
              <button
                className="fuguang-feel-now-btn"
                onClick={(e) => { e.stopPropagation(); handleMoodTag(); }}
              >
                标记心情
              </button>
              <button
                className="fuguang-record-now-btn"
                onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}
              >
                记录当下
              </button>
            </div>
          )}
          {pageState === "revealed" && (
            <p className="fuguang-swap-hint">再次点击光球或卡片可以换一条</p>
          )}

          {/* 首页：记录当下按钮 */}
          {pageState === "idle" && (
            <div className="fuguang-record-now-wrap">
              <button
                className="fuguang-record-now-btn"
                onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}
              >
                记录当下
              </button>
            </div>
          )}

          {/* 信纸作答区 */}
          {showEnvelope && (
            <div className="fuguang-letter">
              {envelopeImage && (
                <div className="fuguang-letter-photo">
                  <img src={envelopeImage} alt="预览" />
                </div>
              )}
              <input
                className="fuguang-letter-title"
                placeholder="标题"
                value={envelopeTitle}
                onChange={(e) => setEnvelopeTitle(e.target.value)}
                autoFocus
              />
              <textarea
                className="fuguang-letter-body"
                placeholder="正文..."
                value={envelopeText}
                onChange={(e) => setEnvelopeText(e.target.value)}
                rows={4}
              />
              <div className="fuguang-letter-foot">
                <button
                  className="fuguang-letter-camera"
                  onClick={handleEnvelopePhoto}
                  aria-label="拍照"
                >
                  📷
                </button>
                <button
                  className="fuguang-letter-submit"
                  onClick={handleEnvelopeSubmit}
                  disabled={!envelopeTitle.trim() && !envelopeText.trim() && !envelopeImage}
                >
                  存入时光
                </button>
              </div>
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
          {pageState === "collected" && (
            <div className="fuguang-collected">
              <p className="fuguang-response-text">已存入时光印记</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="fuguang-action-ghost mt-8"
              >
                再拾一段
              </button>
            </div>
          )}

        </div>

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
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
    </div>
  );
}

<<<<<<< HEAD
=======
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

>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
export default App;
