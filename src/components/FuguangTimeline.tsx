<<<<<<< HEAD
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlassJar from "./GlassJar";
import MoodHeatmap from "./MoodHeatmap";
import MoodReport from "./MoodReport";
import SwipeCard from "./SwipeCard";
import type { MemoryEntry, FragmentData } from "../utils/memoryUtils";
import { loadUserFragments, loadStickersFromStorage } from "../utils/memoryUtils";
=======
import React, { useMemo, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

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
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4

interface FuguangTimelineProps {
  entries: MemoryEntry[];
  onClose?: () => void;
  onDelete?: (id: number) => void;
<<<<<<< HEAD
  onShare?: (entry: MemoryEntry) => void;
}

function groupByDate(entries: MemoryEntry[]): { date: string; entries: MemoryEntry[] }[] {
  const groups = new Map<string, MemoryEntry[]>();
  entries.forEach((e) => { if (!groups.has(e.date)) groups.set(e.date, []); groups.get(e.date)!.push(e); });
  return Array.from(groups.entries()).map(([date, entries]) => ({ date, entries })).sort((a, b) => {
    const [am, ad] = a.date.replace("日", "").split("月").map(Number);
    const [bm, bd] = b.date.replace("日", "").split("月").map(Number);
    if (am !== bm) return bm - am;
    return bd - ad;
  });
=======
}

function groupByDate(
  entries: MemoryEntry[],
): { date: string; entries: MemoryEntry[] }[] {
  const groups = new Map<string, MemoryEntry[]>();
  entries.forEach((e) => {
    if (!groups.has(e.date)) groups.set(e.date, []);
    groups.get(e.date)!.push(e);
  });
  return Array.from(groups.entries())
    .map(([date, entries]) => ({ date, entries }))
    .sort((a, b) => {
      const [am, ad] = a.date.replace("日", "").split("月").map(Number);
      const [bm, bd] = b.date.replace("日", "").split("月").map(Number);
      if (am !== bm) return bm - am;
      return bd - ad;
    });
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
}

function isToday(dateStr: string): boolean {
  const now = new Date();
<<<<<<< HEAD
  return dateStr === `${now.getMonth() + 1}月${now.getDate()}日`;
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return dateStr === `${d.getMonth() + 1}月${d.getDate()}日`;
=======
  const today = `${now.getMonth() + 1}月${now.getDate()}日`;
  return dateStr === today;
}

function isYesterday(dateStr: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = `${d.getMonth() + 1}月${d.getDate()}日`;
  return dateStr === yesterday;
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
}

function formatDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "今天";
  if (isYesterday(dateStr)) return "昨天";
  return dateStr;
}

<<<<<<< HEAD
const FuguangTimeline: React.FC<FuguangTimelineProps> = ({ entries, onClose, onDelete, onShare }) => {
  const [tab, setTab] = useState<"records" | "fragments">("records");
=======
// ===== 玻璃罐萤火虫（支持切换月份）=====
function GlassJar({
  entries,
  month,
  year,
  onDayClick,
  onPrevMonth,
  onNextMonth,
  hasPrev,
  hasNext,
}: {
  entries: MemoryEntry[];
  month: number;
  year: number;
  onDayClick?: (dateStr: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const starsRef = useRef<Array<{
    x: number; y: number; day: number; color: string; count: number;
    baseX: number; baseY: number; radius: number; phase: number;
  }>>([]);
  const daysInMonth = new Date(year, month, 0).getDate();

  const dayMap = useMemo(() => {
    const map = new Map<number, { count: number; colors: string[] }>();
    entries.forEach((e) => {
      if (e.month !== month) return;
      const d = parseInt(e.date.split("月")[1].replace("日", ""));
      if (!map.has(d)) map.set(d, { count: 0, colors: [] });
      const rec = map.get(d)!;
      rec.count++;
      if (e.moodColor) rec.colors.push(e.moodColor);
    });
    return map;
  }, [entries, month]);

  const stars = useMemo(() => {
    const result: typeof starsRef.current = [];
    const jarLeft = 0.08, jarRight = 0.92, jarTop = 0.12, jarBottom = 0.82;
    for (let day = 1; day <= daysInMonth; day++) {
      const rec = dayMap.get(day);
      const seed = day * 37 + month * 131 + year * 7;
      const sx = (Math.sin(seed * 0.427) + 1) * 0.5;
      const sy = (Math.cos(seed * 0.319) + 1) * 0.5;
      const x = jarLeft + sx * (jarRight - jarLeft);
      const y = jarTop + sy * (jarBottom - jarTop);
      const radius = rec ? (rec.count >= 2 ? 3.5 : 2.8) : 1.2;
      const color = rec && rec.colors.length > 0
        ? rec.colors[rec.colors.length - 1]
        : "";
      result.push({
        x, y, day, color, count: rec?.count || 0,
        baseX: x, baseY: y, radius, phase: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, [dayMap, daysInMonth, month, year]);

  starsRef.current = stars;

  const draw = useCallback((canvas: HTMLCanvasElement | null, time: number) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#F7F4ED";
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const jw = W * 0.72, jh = H * 0.72;
    const jtop = H * 0.08, jbottom = jtop + jh;
    const jleft = cx - jw / 2, jright = cx + jw / 2;
    const jr = jw * 0.15;
    const neckW = jw * 0.32, neckH = H * 0.06, neckY = jtop - neckH;

    // 罐子阴影
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(cx, jbottom + 6, jw * 0.1, cx, jbottom, jw * 0.8);
    shadowGrad.addColorStop(0, "rgba(180,160,140,0.08)");
    shadowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, jtop, W, H);
    ctx.restore();

    // 玻璃罐身
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(jleft + jr, jtop);
    ctx.lineTo(jright - jr, jtop);
    ctx.quadraticCurveTo(jright, jtop, jright, jtop + jr);
    ctx.lineTo(jright, jbottom - jr);
    ctx.quadraticCurveTo(jright, jbottom, jright - jr, jbottom);
    ctx.lineTo(jleft + jr, jbottom);
    ctx.quadraticCurveTo(jleft, jbottom, jleft, jbottom - jr);
    ctx.lineTo(jleft, jtop + jr);
    ctx.quadraticCurveTo(jleft, jtop, jleft + jr, jtop);
    ctx.closePath();
    const glassGrad = ctx.createLinearGradient(jleft, 0, jright, 0);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    glassGrad.addColorStop(0.2, "rgba(255,255,255,0.07)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.03)");
    glassGrad.addColorStop(0.8, "rgba(255,255,255,0.08)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.22)");
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(180,170,155,0.25)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // 高光
    ctx.beginPath();
    ctx.ellipse(cx - jw * 0.28, jtop + jh * 0.25, jw * 0.06, jh * 0.12, -0.15, 0, Math.PI * 2);
    const hlGrad = ctx.createRadialGradient(cx - jw * 0.28, jtop + jh * 0.25, 0, cx - jw * 0.28, jtop + jh * 0.25, jw * 0.06);
    hlGrad.addColorStop(0, "rgba(255,255,255,0.4)");
    hlGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hlGrad;
    ctx.fill();
    ctx.restore();

    // 罐口
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - neckW / 2, neckY);
    ctx.lineTo(cx + neckW / 2, neckY);
    ctx.lineTo(cx + neckW / 2 + 3, jtop);
    ctx.lineTo(cx - neckW / 2 - 3, jtop);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.strokeStyle = "rgba(180,170,155,0.2)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // 萤火虫星星
    const t = time * 0.001;
    const jarAreaLeft = jleft + 16, jarAreaRight = jright - 16;
    const jarAreaTop = jtop + 16, jarAreaBottom = jbottom - 14;

    starsRef.current.forEach((s) => {
      const sx = jarAreaLeft + s.baseX * (jarAreaRight - jarAreaLeft);
      const sy = jarAreaTop + s.baseY * (jarAreaBottom - jarAreaTop);
      const floatX = Math.sin(t * 0.7 + s.phase) * 3;
      const floatY = Math.cos(t * 0.5 + s.phase * 1.3) * 2.5;
      const px = sx + floatX;
      const py = sy + floatY;

      if (s.color) {
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.8 + s.phase * 3.1);
        const flicker = 0.15 + 0.85 * Math.sin(t * 2.7 + s.phase * 2.3);
        const bright = Math.max(0.08, flicker);

        const outerGlow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 4.5);
        outerGlow.addColorStop(0, s.color + "28");
        outerGlow.addColorStop(0.35, s.color + "0C");
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow;
        ctx.globalAlpha = 0.3 + 0.7 * breathe;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        const innerGlow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 2.2);
        innerGlow.addColorStop(0, s.color + "88");
        innerGlow.addColorStop(0.5, s.color + "33");
        innerGlow.addColorStop(1, s.color + "00");
        ctx.fillStyle = innerGlow;
        ctx.globalAlpha = 0.3 + 0.7 * breathe;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        const coreGlow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 1.3);
        coreGlow.addColorStop(0, `rgba(255,255,250,${0.85 * bright})`);
        coreGlow.addColorStop(0.6, `rgba(255,255,250,${0.25 * bright})`);
        coreGlow.addColorStop(1, "rgba(255,255,250,0)");
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const dim = 0.06 + 0.03 * Math.sin(t * 0.5 + s.phase);
        ctx.fillStyle = `rgba(200,195,185,${dim})`;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [month, year]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let running = true;
    const loop = (time: number) => {
      if (!running) return;
      draw(canvas, time);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [draw]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDayClick) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const W = rect.width, H = rect.height;
    const jarAreaLeft = (0.08 + 16 / W) * W, jarAreaRight = (0.92 - 16 / W) * W;
    const jarAreaTop = (0.12 + 16 / H) * H, jarAreaBottom = (0.82 - 14 / H) * H;
    let bestDist = Infinity, bestDay = -1;
    starsRef.current.forEach((s) => {
      const sx = jarAreaLeft + s.baseX * (jarAreaRight - jarAreaLeft);
      const sy = jarAreaTop + s.baseY * (jarAreaBottom - jarAreaTop);
      const dist = Math.hypot(cx - sx, cy - sy);
      if (dist < 28 && dist < bestDist) { bestDist = dist; bestDay = s.day; }
    });
    if (bestDay > 0) onDayClick(`${month}月${bestDay}日`);
  }, [onDayClick, month]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {});
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fuguang-glass-jar-wrap">
      <div className="fuguang-glass-jar-title-row">
        <button
          className={`fuguang-glass-jar-arrow ${!hasPrev ? "disabled" : ""}`}
          onClick={onPrevMonth}
          disabled={!hasPrev}
          aria-label="上个月"
        >
          ←
        </button>
        <p className="fuguang-glass-jar-label">{month}月情绪收集罐</p>
        <button
          className={`fuguang-glass-jar-arrow ${!hasNext ? "disabled" : ""}`}
          onClick={onNextMonth}
          disabled={!hasNext}
          aria-label="下个月"
        >
          →
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="fuguang-glass-jar-canvas"
        onClick={handleClick}
      />
    </div>
  );
}

// ===== 滑动删除卡片 =====
function SwipeCard({
  entry, gIdx, eIdx, onDelete,
  hasConnectorAbove, hasConnectorBelow,
}: {
  entry: MemoryEntry;
  gIdx: number;
  eIdx: number;
  onDelete?: (id: number) => void;
  hasConnectorAbove?: boolean;
  hasConnectorBelow?: boolean;
}) {
  const [swipeX, setSwipeX] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const DELETE_THRESHOLD = 55;

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startRef.current = { x: clientX, y: clientY };
    currentRef.current = swipeX;
  }, [swipeX]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!startRef.current) return;
    const dx = clientX - startRef.current.x;
    const dy = Math.abs(clientY - startRef.current.y);
    if (dy > Math.abs(dx) * 0.6) return;
    const next = Math.min(0, Math.max(-120, currentRef.current + dx));
    setSwipeX(next);
    setShowDelete(next < -DELETE_THRESHOLD);
  }, []);

  const handleEnd = useCallback(() => {
    startRef.current = null;
    setSwipeX(prev => {
      if (prev < -DELETE_THRESHOLD) {
        setShowDelete(true);
        return -78;
      }
      setShowDelete(false);
      return 0;
    });
  }, []);

  // Pointer events (桌面)
  const onPointerDown = (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); handleStart(e.clientX, e.clientY); };
  const onPointerMove = (e: React.PointerEvent) => { handleMove(e.clientX, e.clientY); };
  const onPointerUp = () => handleEnd();

  // Touch events (移动端兜底)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    handleStart(t.clientX, t.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  };
  const onTouchEnd = () => handleEnd();

  return (
    <div ref={wrapRef} className="fuguang-swipe-card-wrap" style={{ position: "relative" }}>
      <button
        className={`fuguang-swipe-delete-btn ${showDelete ? "visible" : ""}`}
        onClick={() => onDelete?.(entry.id)}
        aria-label="删除"
      >
        删除
      </button>
      <motion.div
        className={`fuguang-timeline-card ${hasConnectorAbove ? "connector-above" : ""} ${hasConnectorBelow ? "connector-below" : ""}`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: startRef.current ? "none" : "transform 0.25s ease",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: gIdx * 0.04 + eIdx * 0.02, duration: 0.35, ease: "easeOut" }}
      >
        {/* 左侧时间轴 */}
        <div className="fuguang-timeline-blob-col">
          <span className="fuguang-timeline-blob-time">{entry.time}</span>
          <div className="fuguang-timeline-mood-blob" style={{ backgroundColor: entry.moodColor || "#C8C0B8" }}>
            <div className="fuguang-timeline-blob-shine" />
          </div>
        </div>

        <div className="fuguang-timeline-card-body">
          <div className="fuguang-timeline-card-top">
            <span className="fuguang-timeline-card-keyword">{entry.keyword}</span>
            {entry.moodLabel && (
              <span className="fuguang-timeline-card-mood" style={{ color: entry.moodColor || "#8B7E74" }}>{entry.moodLabel}</span>
            )}
          </div>
          <p className="fuguang-timeline-card-text">{entry.eventText}</p>
          {entry.imageData && (
            <div className="fuguang-timeline-card-image">
              <img src={entry.imageData} alt={entry.keyword} className="fuguang-timeline-card-img" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ===== 主组件 =====
const FuguangTimeline: React.FC<FuguangTimelineProps> = ({ entries, onClose, onDelete }) => {
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
  const today = new Date();
  const [glassMonth, setGlassMonth] = useState(today.getMonth() + 1);
  const glassYear = today.getFullYear();

<<<<<<< HEAD
  const timelineEntries = useMemo(() => entries.filter((e) => e.month === glassMonth), [entries, glassMonth]);
  const dateGroups = useMemo(() => groupByDate(timelineEntries), [timelineEntries]);

  const canGoPrev = glassMonth > 1 || entries.some((e) => e.month < glassMonth);
  const canGoNext = (() => {
    const currentMonth = today.getMonth() + 1;
    return glassMonth < currentMonth || entries.some((e) => e.month > glassMonth);
  })();

  // 碎片历史
  const userFragments = useMemo(() => loadUserFragments(), []);
  const allStickers = useMemo(() => loadStickersFromStorage(), []);

  const getStickerById = (id: number) => allStickers.find((s) => s.id === id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fuguang-timeline-container">
=======
  // 哪些月份有数据
  const monthsWithData = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(`${e.month}`));
    return set;
  }, [entries]);

  const hasPrev = glassMonth > 1 || monthsWithData.has(String(glassMonth - 1));
  const hasNext = glassMonth < 12 || monthsWithData.has(String(glassMonth + 1));
  if (glassMonth === today.getMonth() + 1) {
    // 当前月不能往后切
  }

  const timelineEntries = useMemo(
    () => entries.filter((e) => e.month === glassMonth),
    [entries, glassMonth],
  );
  const dateGroups = useMemo(() => groupByDate(timelineEntries), [timelineEntries]);

  // 计算 hasPrev / hasNext：只要存在该月的数据，或者该月在合理范围内就可以切
  const canGoPrev = useMemo(() => {
    if (glassMonth > 1) return true;
    // 检查是否有更早月份的数据
    return entries.some((e) => e.month < glassMonth);
  }, [glassMonth, entries]);

  const canGoNext = useMemo(() => {
    const currentMonth = today.getMonth() + 1;
    if (glassMonth < currentMonth) return true;
    return entries.some((e) => e.month > glassMonth);
  }, [glassMonth, entries, today]);

  if (entries.length === 0) {
    return (
      <div className="fuguang-timeline-empty">
        <p className="fuguang-timeline-empty-icon">🌱</p>
        <p className="fuguang-timeline-empty-text">还没有记录，去拾一段时光吧</p>
      </div>
    );
  }

  return (
    <div className="fuguang-timeline-container">
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
      {onClose && (
        <div className="fuguang-timeline-header">
          <span className="fuguang-timeline-header-icon">📔</span>
          <span className="fuguang-timeline-header-title">时光印记</span>
<<<<<<< HEAD
=======
          <span className="fuguang-timeline-header-count">{entries.length} 段拾光</span>
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
          <button className="fuguang-timeline-close" onClick={onClose}>✕</button>
        </div>
      )}

<<<<<<< HEAD
      {/* Tab 切换 */}
      <div className="fuguang-timeline-tabs">
        <button
          className={`fuguang-timeline-tab ${tab === "records" ? "active" : ""}`}
          onClick={() => setTab("records")}
        >
          📝 记录
        </button>
        <button
          className={`fuguang-timeline-tab ${tab === "fragments" ? "active" : ""}`}
          onClick={() => setTab("fragments")}
        >
          🪶 碎片
        </button>
      </div>

      {tab === "records" ? (
        <div className="fuguang-timeline-scroll">
          <GlassJar
            entries={entries} month={glassMonth} year={glassYear}
            onDayClick={(ds) => document.getElementById(`tl-day-${ds}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            onPrevMonth={() => canGoPrev && setGlassMonth((m) => m - 1)}
            onNextMonth={() => canGoNext && setGlassMonth((m) => m + 1)}
            hasPrev={canGoPrev} hasNext={canGoNext}
          />
          <MoodHeatmap entries={entries} month={glassMonth} year={glassYear}
            onDayClick={(ds) => document.getElementById(`tl-day-${ds}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          />
          <MoodReport entries={entries} mode="week" />
          {dateGroups.length === 0 ? (
            <p className="fuguang-timeline-empty-month">这个月还没有拾光记录</p>
          ) : (
            dateGroups.map((group, gIdx) => (
              <div key={group.date} className="fuguang-timeline-day-group" id={`tl-day-${group.date}`}>
                <div className="fuguang-timeline-date-label">{formatDateLabel(group.date)}</div>
                {group.entries.map((entry, eIdx, arr) => (
                  <SwipeCard key={entry.id} entry={entry} gIdx={gIdx} eIdx={eIdx}
                    onDelete={onDelete} onShare={onShare}
                    hasConnectorAbove={arr.length > 1 && eIdx > 0}
                    hasConnectorBelow={arr.length > 1 && eIdx < arr.length - 1}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="fuguang-timeline-scroll">
          {userFragments.length === 0 ? (
            <div className="fuguang-timeline-fragments-empty">
              <p className="fuguang-timeline-fragments-empty-icon">🪶</p>
              <p className="fuguang-timeline-fragments-empty-text">还没有留下过碎片</p>
              <p className="fuguang-timeline-fragments-empty-hint">看到别人的碎片，心有所感时<br/>可以「也留一片」</p>
            </div>
          ) : (
            <div className="fuguang-timeline-fragments-list">
              {userFragments.map((f) => (
                <div key={f.id} className="fuguang-fragment-item">
                  <div className="fuguang-fragment-item-text">{f.text}</div>
                  {f.stickerId && getStickerById(f.stickerId) && (
                    <div className="fuguang-fragment-item-sticker">
                      <img src={getStickerById(f.stickerId)!.dataUrl} alt="" />
                    </div>
                  )}
                  <div className="fuguang-fragment-item-date">
                    {f.date} {f.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`
        .fuguang-timeline-tabs {
          display: flex; gap: 0; padding: 0 16px;
          border-bottom: 1px solid #eee8e0;
          position: sticky; top: 0; background: #f7f4ed; z-index: 5;
        }
        .fuguang-timeline-tab {
          flex: 1; padding: 10px 0; border: none; background: none;
          font-size: 14px; color: #b0a090; cursor: pointer; font-family: inherit;
          border-bottom: 2px solid transparent; transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .fuguang-timeline-tab.active {
          color: #4a3f35; border-bottom-color: #D87850; font-weight: 500;
        }
        .fuguang-timeline-fragments-empty {
          text-align: center; padding: 60px 20px;
        }
        .fuguang-timeline-fragments-empty-icon { font-size: 36px; margin-bottom: 8px; }
        .fuguang-timeline-fragments-empty-text {
          font-size: 15px; color: #8a7a6a; margin-bottom: 6px;
        }
        .fuguang-timeline-fragments-empty-hint {
          font-size: 12px; color: #c0b5a5; line-height: 1.6;
        }
        .fuguang-timeline-fragments-list {
          padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .fuguang-fragment-item {
          background: #faf8f5; border-radius: 14px; padding: 16px;
          border: 1px solid #eee8e0;
        }
        .fuguang-fragment-item-text {
          font-size: 15px; line-height: 1.7; color: #4a3f35;
          font-weight: 370; letter-spacing: 0.03em;
        }
        .fuguang-fragment-item-sticker {
          margin-top: 10px; width: 48px; height: 48px;
          background: repeating-conic-gradient(#e8e2d8 0% 25%, transparent 0% 50%) 0 0 / 10px 10px;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          padding: 4px;
        }
        .fuguang-fragment-item-sticker img { max-width: 100%; max-height: 100%; display: block; }
        .fuguang-fragment-item-date {
          font-size: 11px; color: #c0b5a5; margin-top: 8px; text-align: right;
        }
      `}</style>
    </motion.div>
=======
      <div className="fuguang-timeline-scroll">
        <GlassJar
          entries={entries}
          month={glassMonth}
          year={glassYear}
          onDayClick={(dateStr) => {
            const el = document.getElementById(`tl-day-${dateStr}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onPrevMonth={() => canGoPrev && setGlassMonth((m) => m - 1)}
          onNextMonth={() => canGoNext && setGlassMonth((m) => m + 1)}
          hasPrev={canGoPrev}
          hasNext={canGoNext}
        />

        {dateGroups.length === 0 ? (
          <p className="fuguang-timeline-empty-month">这个月还没有拾光记录</p>
        ) : (
          dateGroups.map((group, gIdx) => (
            <div key={group.date} className="fuguang-timeline-day-group" id={`tl-day-${group.date}`}>
              <div className="fuguang-timeline-date-label">{formatDateLabel(group.date)}</div>
              {group.entries.map((entry, eIdx, arr) => (
                <SwipeCard
                  key={entry.id}
                  entry={entry}
                  gIdx={gIdx}
                  eIdx={eIdx}
                  onDelete={onDelete}
                  hasConnectorAbove={arr.length > 1 && eIdx > 0}
                  hasConnectorBelow={arr.length > 1 && eIdx < arr.length - 1}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
>>>>>>> a7dac5b3ba7839daf1d108892f57485ec9abf6c4
  );
};

export default FuguangTimeline;
