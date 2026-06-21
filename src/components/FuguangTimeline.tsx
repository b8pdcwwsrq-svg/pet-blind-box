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
}

interface FuguangTimelineProps {
  entries: MemoryEntry[];
  onClose?: () => void;
  onDelete?: (id: number) => void;
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
}

function isToday(dateStr: string): boolean {
  const now = new Date();
  const today = `${now.getMonth() + 1}月${now.getDate()}日`;
  return dateStr === today;
}

function isYesterday(dateStr: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = `${d.getMonth() + 1}月${d.getDate()}日`;
  return dateStr === yesterday;
}

function formatDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "今天";
  if (isYesterday(dateStr)) return "昨天";
  return dateStr;
}

// ===== 玻璃罐萤火虫 =====
function GlassJar({
  entries,
  onDayClick,
}: {
  entries: MemoryEntry[];
  onDayClick?: (dateStr: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const starsRef = useRef<Array<{
    x: number; y: number; day: number; color: string; count: number;
    baseX: number; baseY: number; radius: number; phase: number;
  }>>([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  // 构建天→星映射
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

  // 生成星星
  const stars = useMemo(() => {
    const result: typeof starsRef.current = [];
    // 罐子可用区域（相对坐标 0-1）
    const jarLeft = 0.08, jarRight = 0.92, jarTop = 0.12, jarBottom = 0.82;
    for (let day = 1; day <= daysInMonth; day++) {
      const rec = dayMap.get(day);
      const seed = day * 37 + month * 131;
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
  }, [dayMap, daysInMonth, month]);

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

    // 背景
    ctx.fillStyle = "#F7F4ED";
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const jw = W * 0.72;  // 罐宽
    const jh = H * 0.72;  // 罐高
    const jtop = H * 0.08;
    const jbottom = jtop + jh;
    const jleft = cx - jw / 2;
    const jright = cx + jw / 2;
    const jr = jw * 0.15; // 罐角半径
    const neckW = jw * 0.32;
    const neckH = H * 0.06;
    const neckY = jtop - neckH;

    // 罐子阴影（底部）
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(cx, jbottom + 6, jw * 0.1, cx, jbottom, jw * 0.8);
    shadowGrad.addColorStop(0, "rgba(180,160,140,0.08)");
    shadowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, jtop, W, H);
    ctx.restore();

    // 玻璃罐身 —— 磨砂透明
    ctx.save();
    // 罐身路径
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
    // 玻璃填充
    const glassGrad = ctx.createLinearGradient(jleft, 0, jright, 0);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    glassGrad.addColorStop(0.2, "rgba(255,255,255,0.07)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.03)");
    glassGrad.addColorStop(0.8, "rgba(255,255,255,0.08)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.22)");
    ctx.fillStyle = glassGrad;
    ctx.fill();
    // 玻璃边框
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
    const jarAreaLeft = jleft + 16;
    const jarAreaRight = jright - 16;
    const jarAreaTop = jtop + 16;
    const jarAreaBottom = jbottom - 14;

    starsRef.current.forEach((s) => {
      const sx = jarAreaLeft + s.baseX * (jarAreaRight - jarAreaLeft);
      const sy = jarAreaTop + s.baseY * (jarAreaBottom - jarAreaTop);

      // 漂浮偏移
      const floatX = Math.sin(t * 0.7 + s.phase) * 3;
      const floatY = Math.cos(t * 0.5 + s.phase * 1.3) * 2.5;
      const px = sx + floatX;
      const py = sy + floatY;

      if (s.color) {
        // 有情绪 —— 彩色萤火虫（低饱和 + 呼吸闪烁）
        // 闪烁因子 —— 每颗星独立的呼吸节奏，0→1 循环
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.8 + s.phase * 3.1);
        const flicker = 0.15 + 0.85 * Math.sin(t * 2.7 + s.phase * 2.3);
        const bright = Math.max(0.08, flicker); // 最暗时几乎熄灭

        // 外发光 —— 饱和度降低，跟呼吸同步
        const outerGlow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 4.5);
        outerGlow.addColorStop(0, s.color + "28");
        outerGlow.addColorStop(0.35, s.color + "0C");
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow;
        ctx.globalAlpha = 0.3 + 0.7 * breathe; // 呼吸节奏控制外发光强度
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 内层柔和光晕 —— 跟着呼吸涨缩
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

        // 星核 —— 一闪一闪，从微微亮到骤然发光
        const coreGlow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 1.3);
        coreGlow.addColorStop(0, `rgba(255,255,250,${0.85 * bright})`);
        coreGlow.addColorStop(0.6, `rgba(255,255,250,${0.25 * bright})`);
        coreGlow.addColorStop(1, "rgba(255,255,250,0)");
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 无情绪 —— 暗淡小白点
        const dim = 0.06 + 0.03 * Math.sin(t * 0.5 + s.phase);
        ctx.fillStyle = `rgba(200,195,185,${dim})`;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [month]);

  // 动画循环
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
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  // 点击查找日期
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDayClick) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const W = rect.width, H = rect.height;
    const jarAreaLeft = (0.08 + 16 / W) * W;
    const jarAreaRight = (0.92 - 16 / W) * W;
    const jarAreaTop = (0.12 + 16 / H) * H;
    const jarAreaBottom = (0.82 - 14 / H) * H;

    // 找最近的星星
    let bestDist = Infinity, bestDay = -1;
    starsRef.current.forEach((s) => {
      const sx = jarAreaLeft + s.baseX * (jarAreaRight - jarAreaLeft);
      const sy = jarAreaTop + s.baseY * (jarAreaBottom - jarAreaTop);
      const dist = Math.hypot(cx - sx, cy - sy);
      if (dist < 28 && dist < bestDist) { bestDist = dist; bestDay = s.day; }
    });
    if (bestDay > 0) {
      onDayClick(`${month}月${bestDay}日`);
    }
  }, [onDayClick, month]);

  // 监听 resize 重绘
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      // 触发重绘由动画循环处理
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const titleHeight = 18;
  const totalH = 180;

  return (
    <div className="fuguang-glass-jar-wrap">
      <p className="fuguang-glass-jar-label">{month}月情绪收集罐</p>
      <canvas
        ref={canvasRef}
        className="fuguang-glass-jar-canvas"
        style={{ height: totalH - titleHeight - 10 }}
        onClick={handleClick}
      />
    </div>
  );
}

// ===== 可滑动删除的卡片 =====
function SwipeCard({
  entry,
  gIdx,
  eIdx,
  onDelete,
}: {
  entry: MemoryEntry;
  gIdx: number;
  eIdx: number;
  onDelete?: (id: number) => void;
}) {
  const [swipeX, setSwipeX] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef(0);

  const DELETE_THRESHOLD = 60; // 滑动超过 60px 露出删除按钮

  const handlePointerDown = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    currentRef.current = swipeX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = Math.abs(e.clientY - startRef.current.y);
    // 只响应横向滑动（角度 < 30°）
    if (dy > Math.abs(dx) * 0.58) return;
    const next = Math.min(0, Math.max(-120, currentRef.current + dx));
    setSwipeX(next);
    setShowDelete(next < -DELETE_THRESHOLD);
  };

  const handlePointerUp = () => {
    startRef.current = null;
    if (swipeX < -DELETE_THRESHOLD) {
      setSwipeX(-80);
      setShowDelete(true);
    } else {
      setSwipeX(0);
      setShowDelete(false);
    }
  };

  const handleDeleteTap = () => {
    onDelete?.(entry.id);
  };

  return (
    <motion.div
      className="fuguang-swipe-card-wrap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: gIdx * 0.04 + eIdx * 0.02,
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{ position: "relative" }}
    >
      {/* 红色删除按钮（在卡片后面） */}
      <button
        className={`fuguang-swipe-delete-btn ${showDelete ? "visible" : ""}`}
        onClick={handleDeleteTap}
        aria-label="删除"
      >
        删除
      </button>

      {/* 卡片 */}
      <div
        className="fuguang-timeline-card"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: startRef.current ? "none" : "transform 0.25s ease",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="fuguang-timeline-avatar"
          style={{
            background: entry.moodColor
              ? `linear-gradient(135deg, ${entry.moodColor}22, ${entry.moodColor}44)`
              : "linear-gradient(135deg, #F5E6D3, #EDE0D4)",
          }}
        >
          <span className="fuguang-timeline-avatar-emoji">{entry.emoji}</span>
        </div>

        <div className="fuguang-timeline-card-body">
          <span className="fuguang-timeline-card-keyword">{entry.keyword}</span>
          <p className="fuguang-timeline-card-text">{entry.eventText}</p>

          {entry.imageData && (
            <div className="fuguang-timeline-card-image">
              <img
                src={entry.imageData}
                alt={entry.keyword}
                className="fuguang-timeline-card-img"
              />
            </div>
          )}

          <div className="fuguang-timeline-card-footer">
            <div className="fuguang-timeline-card-footer-left">
              {entry.moodColor && (
                <span
                  className="fuguang-timeline-card-mood-dot"
                  style={{ backgroundColor: entry.moodColor }}
                />
              )}
              {entry.moodLabel && (
                <span
                  className="fuguang-timeline-card-mood"
                  style={{ color: entry.moodColor || "#8B7E74" }}
                >
                  {entry.moodLabel}
                </span>
              )}
              {entry.response && (
                <span className="fuguang-timeline-card-response">
                  「{entry.response}」
                </span>
              )}
            </div>
            <span className="fuguang-timeline-card-time">{entry.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== 主组件 =====
const FuguangTimeline: React.FC<FuguangTimelineProps> = ({
  entries,
  onClose,
  onDelete,
}) => {
  const dateGroups = useMemo(() => groupByDate(entries), [entries]);

  if (entries.length === 0) {
    return (
      <div className="fuguang-timeline-empty">
        <p className="fuguang-timeline-empty-icon">🌱</p>
        <p className="fuguang-timeline-empty-text">
          还没有记录，去拾一段时光吧
        </p>
      </div>
    );
  }

  return (
    <div className="fuguang-timeline-container">
      {onClose && (
        <div className="fuguang-timeline-header">
          <span className="fuguang-timeline-header-icon">📔</span>
          <span className="fuguang-timeline-header-title">时光印记</span>
          <span className="fuguang-timeline-header-count">
            {entries.length} 段拾光
          </span>
          <button className="fuguang-timeline-close" onClick={onClose}>
            ✕
          </button>
        </div>
      )}

      <div className="fuguang-timeline-scroll">
        {/* 玻璃罐萤火虫 */}
        <GlassJar
          entries={entries}
          onDayClick={(dateStr) => {
            // 滚动到对应日期
            const el = document.getElementById(`tl-day-${dateStr}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />

        {/* 时间轴卡片 */}
        {dateGroups.map((group, gIdx) => (
          <div
            key={group.date}
            className="fuguang-timeline-day-group"
            id={`tl-day-${group.date}`}
          >
            <div className="fuguang-timeline-date-label">
              {formatDateLabel(group.date)}
            </div>
            {group.entries.map((entry, eIdx) => (
              <SwipeCard
                key={entry.id}
                entry={entry}
                gIdx={gIdx}
                eIdx={eIdx}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuguangTimeline;
