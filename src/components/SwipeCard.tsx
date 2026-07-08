import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { MemoryEntry } from "../utils/memoryUtils";

function stripHtml(html: string): string {
  if (!html) return "";
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.innerText || "";
}

interface SwipeCardProps {
  entry: MemoryEntry;
  gIdx: number;
  eIdx: number;
  onDelete?: (id: number) => void;
  onShare?: (entry: MemoryEntry) => void;
  hasConnectorAbove?: boolean;
  hasConnectorBelow?: boolean;
}

export default function SwipeCard({ entry, gIdx, eIdx, onDelete, onShare, hasConnectorAbove, hasConnectorBelow }: SwipeCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef(0);
  const DELETE_THRESHOLD = 55;

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startRef.current = { x: clientX, y: clientY };
    currentRef.current = swipeX;
  }, [swipeX]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!startRef.current) return;
    const dx = clientX - startRef.current.x;
    if (Math.abs(clientY - startRef.current.y) > Math.abs(dx) * 0.6) return;
    setSwipeX(Math.min(0, Math.max(-120, currentRef.current + dx)));
    setShowDelete(currentRef.current + dx < -DELETE_THRESHOLD);
  }, []);

  const handleEnd = useCallback(() => {
    startRef.current = null;
    setSwipeX((prev) => {
      if (prev < -DELETE_THRESHOLD) { setShowDelete(true); return -78; }
      setShowDelete(false); return 0;
    });
  }, []);

  return (
    <div ref={wrapRef} className="fuguang-swipe-card-wrap" style={{ position: "relative" }}>
      <button className={`fuguang-swipe-delete-btn ${showDelete ? "visible" : ""}`} onClick={() => onDelete?.(entry.id)} aria-label="删除">删除</button>
      <motion.div
        className={`fuguang-timeline-card ${hasConnectorAbove ? "connector-above" : ""} ${hasConnectorBelow ? "connector-below" : ""}`}
        style={{ transform: `translateX(${swipeX}px)`, transition: startRef.current ? "none" : "transform 0.25s ease", touchAction: "pan-y" }}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); handleStart(e.clientX, e.clientY); }}
        onPointerMove={(e) => handleMove(e.clientX, e.clientY)}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onTouchStart={(e) => { const t = e.touches[0]; handleStart(t.clientX, t.clientY); }}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY); }}
        onTouchEnd={handleEnd}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: gIdx * 0.06 + eIdx * 0.03, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="fuguang-timeline-blob-col">
          <span className="fuguang-timeline-blob-time">{entry.time}</span>
          <div className="fuguang-timeline-mood-blob" style={{ backgroundColor: entry.moodColor || "#C8C0B8", opacity: 0.45 }}>
            <div className="fuguang-timeline-blob-shine" />
          </div>
        </div>
        <div className="fuguang-timeline-card-body">
          <div className="fuguang-timeline-card-top">
            <span className="fuguang-timeline-card-keyword">{entry.keyword}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {entry.moodLabel && (
                <span className="fuguang-timeline-card-mood" style={{ color: entry.moodColor || "#8B7E74" }}>{entry.moodLabel}</span>
              )}
              {onShare && (
                <button className="fuguang-timeline-share-btn" onClick={(e) => { e.stopPropagation(); onShare(entry); }} aria-label="分享">↗</button>
              )}
            </div>
          </div>
          <p className="fuguang-timeline-card-text">{entry.eventText}</p>
          {entry.imageData && (
            <div className="fuguang-timeline-card-image"><img src={entry.imageData} alt={entry.keyword} className="fuguang-timeline-card-img" /></div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
