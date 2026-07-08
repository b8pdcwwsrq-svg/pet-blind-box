import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FuguangTimeline from "./components/FuguangTimeline";
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

  const [isDragging, setIsDragging] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef<{ y: number; time: number } | null>(null);
  const dragYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const season = useMemo(() => getSeason(), []);

  useEffect(() => { const i = setInterval(() => setBreathePhase(p => (p + 1) % 3), 4000); return () => clearInterval(i); }, []);
  const handleCloseWelcome = useCallback(() => { setShowWelcome(false); localStorage.setItem("fuguang-visited", "true"); }, []);
  useEffect(() => { if (!moodFeedbackMsg) return; const t = setTimeout(() => setMoodFeedbackMsg(""), 3000); return () => clearTimeout(t); }, [moodFeedbackMsg]);
  useEffect(() => { return () => { if (dragTimerRef.current) clearTimeout(dragTimerRef.current); }; }, []);

  const handleOrbClick = useCallback(() => {
    if (isAnimating) return;
    if (pageState !== "idle" && pageState !== "revealed") return;
    setIsAnimating(true);
    setPageState("loading");
    setCurrentEvent(null);
    const period = getCurrentPeriod();
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
    </div>
  );
}

export default App;
