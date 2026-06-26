import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FuguangTimeline from "./components/FuguangTimeline";
import {
  ALL_EVENTS, ALL_MOODS, MemoryEntry,
  getCurrentPeriod, getTodaySolarTerm, getGanZhiDate,
  getSeason, getTimeStr,
  loadMemoryFromStorage, saveMemoryToStorage,
} from "./utils/memoryUtils";

const SEASON_MUSIC: Record<string, string[]> = {
  spring: [
    "https://cdn.pixabay.com/download/audio/2022/06/25/audio_661917b8e6.mp3?filename=relaxing-music-118190.mp3",
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_7b8c0fea55.mp3?filename=zen-meditation-112720.mp3",
  ],
  summer: [
    "https://cdn.pixabay.com/download/audio/2022/08/16/audio_8442df4de7.mp3?filename=calm-piano-121957.mp3",
    "https://cdn.pixabay.com/download/audio/2022/09/21/audio_3a5ac71df9.mp3?filename=meditation-149493.mp3",
  ],
  autumn: [
    "https://cdn.pixabay.com/download/audio/2023/03/22/audio_e7e5e5d15a.mp3?filename=peaceful-mind-155704.mp3",
    "https://cdn.pixabay.com/download/audio/2023/01/24/audio_bda129a5ce.mp3?filename=deep-meditation-174871.mp3",
  ],
  winter: [
    "https://cdn.pixabay.com/download/audio/2023/02/13/audio_d23d599996.mp3?filename=ambient-meditation-174881.mp3",
    "https://cdn.pixabay.com/download/audio/2023/04/05/audio_e1408e86b3.mp3?filename=zen-garden-176935.mp3",
  ],
};

let audioInstance: HTMLAudioElement | null = null;

// ===== 主组件 =====
function App() {
  const [pageState, setPageState] = useState<"idle" | "loading" | "revealed" | "collected">("idle");
  const [currentEvent, setCurrentEvent] = useState<typeof ALL_EVENTS[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(loadMemoryFromStorage());
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [orbFlash, setOrbFlash] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeTitle, setEnvelopeTitle] = useState("");
  const [envelopeText, setEnvelopeText] = useState("");
  const [envelopeImage, setEnvelopeImage] = useState<string | null>(null);

  // ===== 呼吸引导相位 =====
  const [breathePhase, setBreathePhase] = useState(0);
  const breatheLabels = ["吸气…", "屏息…", "呼气…"];

  // ===== 首次引导 =====
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("fuguang-visited"));
  const [moodFeedbackMsg, setMoodFeedbackMsg] = useState("");

  const MOOD_FEEDBACK: Record<string, string[]> = {
    calm: ["平静很好，像水面一样。", "什么都不缺，这一刻就够了。"],
    warm: ["温暖的感觉，记住了。", "心里有光，哪怕是一点点。"],
    happy: ["开心是可以的，不用觉得不真实。", "这个瞬间值得被收藏。"],
    content: ["满足不是终点，是路上的风景。", "这样就很好，不需要更多。"],
    sad: ["低落也是可以的，让它待一会儿。", "不一定要好起来，先待在这里。"],
    tired: ["累了就是累了，不需要理由。", "休息不是偷懒，是在积蓄。"],
  };

  // ===== 拖拽 & 银河状态 =====
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

  // 呼吸相位同步
  useEffect(() => {
    const interval = setInterval(() => setBreathePhase(p => (p + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, []);

  // 首次引导关闭
  const handleCloseWelcome = useCallback(() => {
    setShowWelcome(false);
    localStorage.setItem("fuguang-visited", "true");
  }, []);

  // 情绪反馈 3 秒消失
  useEffect(() => {
    if (!moodFeedbackMsg) return;
    const timer = setTimeout(() => setMoodFeedbackMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [moodFeedbackMsg]);

  // 清理拖拽计时器
  useEffect(() => {
    return () => { if (dragTimerRef.current) clearTimeout(dragTimerRef.current); };
  }, []);

  // ===== 点击光球：idle抽取 / revealed任意换 =====
  const handleOrbClick = useCallback(() => {
    if (isAnimating) return;
    if (pageState !== "idle" && pageState !== "revealed") return;
    setIsAnimating(true);
    setPageState("loading");
    setCurrentEvent(null);
    const period = getCurrentPeriod();
    const suitableEvents = ALL_EVENTS.filter(
      (t) => t.period.includes(period) || t.period.includes("anytime"),
    );
    const randomEvent = suitableEvents[Math.floor(Math.random() * suitableEvents.length)];
    setTimeout(() => {
      setCurrentEvent(randomEvent);
      setPageState("revealed");
      setIsAnimating(false);
    }, 700);
  }, [isAnimating, pageState]);

  // ===== 音乐 =====
  const toggleMusic = useCallback(() => {
    if (!audioInstance) {
      const tracks = SEASON_MUSIC[season];
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      audioInstance = new Audio();
      audioInstance.src = track;
      audioInstance.loop = true;
      audioInstance.volume = 0.25;
      audioInstance.load();
    }
    if (isMusicPlaying) {
      audioInstance.pause();
      setIsMusicPlaying(false);
    } else {
      audioInstance.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  }, [isMusicPlaying, season]);

  // ===== 拖拽手势 =====
  const THRESHOLD_PX = typeof window !== "undefined" ? window.innerHeight * 0.2 : 120;

  const handleOrbPointerDown = useCallback((e: React.PointerEvent) => {
    if (pageState !== "idle" || isAnimating) return;
    dragStartRef.current = { y: e.clientY, time: Date.now() };
    setDragY(0);
    setIsDragging(false);
    setDragReady(false);
    dragTimerRef.current = setTimeout(() => {
      setDragReady(true);
      setIsDragging(true);
      isDraggingRef.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
    }, 200);
  }, [pageState, isAnimating]);

  const handleOrbPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dy = e.clientY - dragStartRef.current.y;
    if (!dragReady && Math.abs(dy) > 8) {
      if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
      dragStartRef.current = null;
      return;
    }
    if (!isDraggingRef.current) return;
    if (dy > 0) { dragYRef.current = dy; setDragY(dy); }
  }, [dragReady]);

  const handleOrbPointerUp = useCallback(() => {
    if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    if (!isDraggingRef.current || !dragStartRef.current) {
      dragStartRef.current = null;
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragReady(false);
      dragYRef.current = 0;
      setDragY(0);
      return;
    }
    if (dragYRef.current >= THRESHOLD_PX) setShowTimeline(true);
    dragStartRef.current = null;
    setIsDragging(false);
    isDraggingRef.current = false;
    setDragReady(false);
    dragYRef.current = 0;
    setDragY(0);
  }, []);

  // ===== 记录当下 =====
  const handleRecordNow = useCallback(() => {
    if (isAnimating) return;
    setEnvelopeTitle(""); setEnvelopeText(""); setEnvelopeImage(null);
    setShowEnvelope(true);
  }, [isAnimating]);

  const handleEnvelopePhoto = useCallback(() => cameraInputRef.current?.click(), []);
  const handlePhotoTaken = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEnvelopeImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleEnvelopeSubmit = useCallback(() => {
    if (!envelopeTitle.trim() && !envelopeText.trim() && !envelopeImage) return;
    setShowEnvelope(false);
    setShowMoodPicker(true);
  }, [envelopeTitle, envelopeText, envelopeImage]);

  // ===== 标记心情 =====
  const handleMoodTag = useCallback(() => setShowMoodPicker(true), []);

  const handleMoodSelect = useCallback((mood: typeof ALL_MOODS[0]) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowMoodPicker(false);
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    const timeStr = getTimeStr();

    const title = envelopeTitle.trim();
    const body = envelopeText.trim();
    if (title || body || envelopeImage) {
      const emoji = envelopeImage ? "📷" : "✏️";
      const k = title || body.slice(0, 8);
      const t = body && body !== k ? body : "";
      if (!t && !k && !envelopeImage) return;
      const keyword = k || "留影";
      const newEntry: MemoryEntry = {
        id: Date.now() + Math.random(),
        date: dateStr, month: now.getMonth() + 1, time: timeStr,
        emoji, eventText: t || "", keyword,
        moodId: mood.id, moodLabel: mood.label, moodColor: mood.color,
        response: "", imageData: envelopeImage || undefined, location: "房间",
      };
      setEnvelopeTitle(""); setEnvelopeText(""); setEnvelopeImage(null);
      setTimeout(() => {
        setPageState("collected"); setIsAnimating(false);
        setMemoryEntries(prev => { const u = [newEntry, ...prev]; saveMemoryToStorage(u); return u; });
        setTimeout(() => { setPageState("idle"); setCurrentEvent(null); }, 2500);
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
      setTimeout(() => { setPageState("idle"); setCurrentEvent(null); }, 2500);
    }, 600);
  }, [isAnimating, currentEvent, envelopeTitle, envelopeText, envelopeImage]);

  const handleReset = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true); setShowEnvelope(false);
    setPageState("idle"); setCurrentEvent(null);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  // ===== 渲染 =====
  return (
    <div className="fuguang-page">
      {/* 音乐按钮 */}
      <button className={`fuguang-music-btn ${isMusicPlaying ? "playing" : ""}`}
        onClick={(e) => { e.stopPropagation(); toggleMusic(); }}>
        {isMusicPlaying ? "♪" : "♫"}
      </button>

      {/* 时光印记入口 */}
      <button className="fuguang-timeline-nav"
        onClick={(e) => { e.stopPropagation(); setShowTimeline(true); }}>
        📔
      </button>

      <div className="fuguang-header">
        <p className="fuguang-ganzhi">
          {(() => { const now = new Date(); const term = getTodaySolarTerm(); return term ? `✦ ${term.name} ✦` : `${now.getMonth() + 1}月${now.getDate()}日`; })()}
        </p>
        <h1 className="fuguang-title">今日拾光</h1>
      </div>

      {/* 首次引导 */}
      {showWelcome && (
        <div className="fuguang-welcome-overlay">
          <div className="fuguang-welcome-card">
            <p className="fuguang-welcome-emoji">🫧</p>
            <p className="fuguang-welcome-line">不需要好起来</p>
            <p className="fuguang-welcome-line">只需要感觉到</p>
            <p className="fuguang-welcome-desc">
              每一天，从这里开始<br />做一件小事，觉察自己的情绪<br />低落也可以，不需要"好起来"
            </p>
            <p className="fuguang-welcome-footer">人生嘛，重在体验</p>
            <button className="fuguang-welcome-btn" onClick={handleCloseWelcome}>开始</button>
          </div>
        </div>
      )}

      {moodFeedbackMsg && <div className="fuguang-mood-toast">{moodFeedbackMsg}</div>}

      <div className="fuguang-content">
        {/* 节气卡片 / 呼吸光球 */}
        {(() => {
          const term = getTodaySolarTerm();
          if (term) {
            const seasonC: Record<string, string> = { spring: "#8CB4C4", summer: "#D87850", autumn: "#C8A860", winter: "#B8A8B0" };
            const c = seasonC[term.season];
            return (
              <div className={`fuguang-solar-term-card ${pageState === "idle" ? "fuguang-solar-term-card--tappable" : ""} ${isDragging ? "fuguang-solar-term-card--dragging" : ""}`}
                style={{ borderColor: c + "35", touchAction: isDragging ? "none" : "auto", userSelect: "none", WebkitUserSelect: "none", transform: isDragging ? `translateY(${dragY}px)` : "translateY(0)", transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                onClick={() => { if ((pageState === "idle" || pageState === "revealed") && !isAnimating) handleOrbClick(); }}
                onPointerDown={handleOrbPointerDown} onPointerMove={handleOrbPointerMove}
                onPointerUp={handleOrbPointerUp} onPointerCancel={handleOrbPointerUp}>
                <div className="fuguang-solar-term-name" style={{ color: c }}>{term.name}</div>
                <div className="fuguang-solar-term-poem">{term.poem}</div>
                <div className="fuguang-solar-term-actions">
                  {term.actions.map((a, i) => <span key={i} className="fuguang-solar-term-dot" style={{ borderColor: c + "30" }}>{a}</span>)}
                </div>
                {pageState === "idle" && <p className="fuguang-orb-hint" style={{ position: "relative", bottom: "auto", marginTop: "10px" }}>轻触卡片 · 拾取今日</p>}
                {pageState === "idle" && !isDragging && <span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`} style={{ position: "relative", bottom: "-4px" }}>↓ 继续下拉查看时光印记</span>}
              </div>
            );
          }
          const orbClasses = ["fuguang-orb", pageState === "idle" && !dragReady && "fuguang-orb--idle", orbFlash && "fuguang-orb--flash", dragReady && !isDragging && "fuguang-orb--drag-ready", isDragging && "fuguang-orb--dragging"].filter(Boolean).join(" ");
          return (
            <div className={`fuguang-orb-area ${pageState === "idle" ? "fuguang-orb-area--tappable" : ""} ${isDragging ? "fuguang-orb-area--dragging" : ""}`}
              style={{ touchAction: isDragging ? "none" : "auto", userSelect: "none", WebkitUserSelect: "none", transform: isDragging ? `translateY(${dragY}px)` : "translateY(0)", transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
              onClick={() => { if ((pageState === "idle" || pageState === "revealed") && !isAnimating) handleOrbClick(); }}
              onPointerDown={handleOrbPointerDown} onPointerMove={handleOrbPointerMove}
              onPointerUp={handleOrbPointerUp} onPointerCancel={handleOrbPointerUp}>
              <div className={orbClasses} />
              {pageState === "idle" && !isDragging && (
                <><p className="fuguang-orb-hint">点一下，做一件小事</p><p className="fuguang-orb-breathe-hint">{breatheLabels[breathePhase]}</p><span className={`fuguang-orb-drag-hint ${dragReady ? "visible" : ""}`}>↓ 继续下拉查看时光印记</span></>
              )}
              {isDragging && <span className="fuguang-orb-drag-hint visible">{dragY >= THRESHOLD_PX ? "✧ 松手查看时光印记" : "↓ 继续下拉"}</span>}
            </div>
          );
        })()}

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

        {pageState === "revealed" && currentEvent && (
          <div className="fuguang-reveal">
            <p className="fuguang-event-text" key={currentEvent.id}>{currentEvent.text}</p>
          </div>
        )}

        {pageState === "revealed" && currentEvent && (
          <div className="fuguang-reveal-btns">
            <button className="fuguang-feel-now-btn" onClick={(e) => { e.stopPropagation(); handleMoodTag(); }}>完成小事</button>
            <button className="fuguang-record-now-btn" onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}>记录当下</button>
          </div>
        )}
        {pageState === "revealed" && <p className="fuguang-swap-hint">再次点击光球或卡片可以换一条</p>}

        {pageState === "idle" && (
          <div className="fuguang-record-now-wrap">
            <button className="fuguang-record-now-btn" onClick={(e) => { e.stopPropagation(); handleRecordNow(); }}>记录当下</button>
          </div>
        )}

        {pageState === "idle" && <p className="fuguang-footer-quote">不需要好起来，只需要感觉到</p>}

        {/* 信纸 */}
        {showEnvelope && (
          <div className="fuguang-letter" style={{ position: "relative" }}>
            <button onClick={() => setShowEnvelope(false)}
              style={{ position: "absolute", top: "4px", right: "4px", width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "rgba(180,160,130,0.1)", fontSize: "13px", lineHeight: "24px", textAlign: "center", cursor: "pointer", color: "#b0a090", zIndex: 10, padding: 0, fontFamily: "inherit" }}
              aria-label="关闭">✕</button>
            {envelopeImage && <div className="fuguang-letter-photo"><img src={envelopeImage} alt="预览" /></div>}
            <input className="fuguang-letter-title" placeholder="标题" value={envelopeTitle} onChange={(e) => setEnvelopeTitle(e.target.value)} autoFocus />
            <textarea className="fuguang-letter-body" placeholder="正文..." value={envelopeText} onChange={(e) => setEnvelopeText(e.target.value)} rows={4} />
            <div className="fuguang-letter-foot">
              <button className="fuguang-letter-camera" onClick={handleEnvelopePhoto} aria-label="拍照">📷</button>
              <button className="fuguang-letter-submit" onClick={handleEnvelopeSubmit} disabled={!envelopeTitle.trim() && !envelopeText.trim() && !envelopeImage}>存入时光</button>
            </div>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhotoTaken} />
          </div>
        )}

        {pageState === "collected" && (
          <div className="fuguang-collected">
            <p className="fuguang-response-text">已存入时光印记</p>
            <p className="fuguang-collected-count">你今天积累了 {memoryEntries.length} 个情绪时刻</p>
            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="fuguang-action-ghost mt-8">再拾一段</button>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    const msgs = MOOD_FEEDBACK[mood.id];
                    if (msgs) setMoodFeedbackMsg(msgs[Math.floor(Math.random() * msgs.length)]);
                    handleMoodSelect(mood);
                  }}>
                  <div className="fuguang-mood-circle" style={{ backgroundColor: mood.color }}>{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 时间轴 */}
      <AnimatePresence>
        {showTimeline && (
          <FuguangTimeline
            entries={memoryEntries}
            onClose={() => setShowTimeline(false)}
            onDelete={(id) => { setMemoryEntries(prev => { const u = prev.filter((e) => e.id !== id); saveMemoryToStorage(u); return u; }); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
