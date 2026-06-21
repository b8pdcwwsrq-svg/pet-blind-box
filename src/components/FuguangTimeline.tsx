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

// ===== 情绪画布组件 =====
function MoodCanvas({ entries }: { entries: MemoryEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  // 按日期索引记录数
  const dayMap = useMemo(() => {
    const map = new Map<number, { count: number; colors: string[] }>();
    entries.forEach((e) => {
      const m = e.month;
      if (m !== month) return;
      const d = parseInt(e.date.split("月")[1].replace("日", ""));
      if (!map.has(d)) map.set(d, { count: 0, colors: [] });
      const rec = map.get(d)!;
      rec.count++;
      if (e.moodColor) rec.colors.push(e.moodColor);
    });
    return map;
  }, [entries, month]);

  const draw = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // 宣纸底色
      ctx.fillStyle = "#F5F1E7";
      ctx.fillRect(0, 0, w, h);

      // 纸张纤维：随机分布极浅的横纹
      ctx.save();
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < h; i += 3 + Math.random() * 4) {
        ctx.fillStyle = i % 7 === 0 ? "#C8B898" : "#D4C8B0";
        ctx.fillRect(0, i, w, 1);
      }
      // 稀疏竖纹
      for (let i = 0; i < w; i += 18 + Math.random() * 22) {
        ctx.fillStyle = "#C0B498";
        ctx.fillRect(i, 0, 0.5, h);
      }
      ctx.restore();

      // 纸张颗粒：极细噪点
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      const seed = 42;
      for (let i = 0; i < d.length; i += 4) {
        const r = (Math.sin(seed + i * 0.00037) + 1) * 0.5;
        const n = (r - 0.5) * 5;
        d[i] = Math.min(255, Math.max(0, d[i] + n));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n + 2));
      }
      ctx.putImageData(imageData, 0, 0);

      const cols = 7;
      const rows = Math.ceil(daysInMonth / 7);
      const cellW = w / cols;
      const cellH = h / rows;

      // 先确定当月第一天是周几（日=0 月=1...六=6）
      const firstDay = new Date(year, month - 1, 1).getDay();
      // 计算每周的行起始偏移（周日=第0列）

      // 画每个有记录的日期
      dayMap.forEach((rec, day) => {
        const idx = day - 1; // 0-based index
        const row = Math.floor((idx + firstDay) / 7);
        const col = (idx + firstDay) % 7;
        if (row >= rows) return;

        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;
        const maxRadius = Math.min(cellW, cellH) * 0.7;

        // 多色叠加晕染
        const uniqueColors = [...new Set(rec.colors)];
        if (uniqueColors.length === 0) return;

        // 每个颜色画一层径向渐变，叠加
        uniqueColors.forEach((color, ci) => {
          const r = maxRadius * (0.5 + 0.5 * (1 - ci / uniqueColors.length));
          const grad = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
          grad.addColorStop(0, color + "88");
          grad.addColorStop(0.35, color + "44");
          grad.addColorStop(0.7, color + "0D");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        });

        // 多条记录时叠加一个小光点
        if (rec.count >= 2) {
          const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.18);
          dotGrad.addColorStop(0, "rgba(255,255,255,0.6)");
          dotGrad.addColorStop(1, "transparent");
          ctx.fillStyle = dotGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, maxRadius * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    [dayMap, daysInMonth, year, month],
  );

  // 初次渲染后绘制
  React.useEffect(() => {
    draw(canvasRef.current);
  }, [draw]);

  // 监听 resize
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw(canvas));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div className="fuguang-mood-canvas-wrap">
      <p className="fuguang-mood-canvas-label">
        {month}月情绪画布
      </p>
      <canvas
        ref={canvasRef}
        className="fuguang-mood-canvas"
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
        {/* 情绪画布 */}
        <MoodCanvas entries={entries} />

        {/* 时间轴卡片 */}
        {dateGroups.map((group, gIdx) => (
          <div key={group.date} className="fuguang-timeline-day-group">
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
