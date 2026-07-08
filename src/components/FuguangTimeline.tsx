import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlassJar from "./GlassJar";
import MoodHeatmap from "./MoodHeatmap";
import MoodReport from "./MoodReport";
import SwipeCard from "./SwipeCard";
import type { MemoryEntry, FragmentData } from "../utils/memoryUtils";
import { loadUserFragments, loadStickersFromStorage } from "../utils/memoryUtils";

interface FuguangTimelineProps {
  entries: MemoryEntry[];
  onClose?: () => void;
  onDelete?: (id: number) => void;
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
}

function isToday(dateStr: string): boolean {
  const now = new Date();
  return dateStr === `${now.getMonth() + 1}月${now.getDate()}日`;
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return dateStr === `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "今天";
  if (isYesterday(dateStr)) return "昨天";
  return dateStr;
}

const FuguangTimeline: React.FC<FuguangTimelineProps> = ({ entries, onClose, onDelete, onShare }) => {
  const [tab, setTab] = useState<"records" | "fragments">("records");
  const today = new Date();
  const [glassMonth, setGlassMonth] = useState(today.getMonth() + 1);
  const glassYear = today.getFullYear();

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
      {onClose && (
        <div className="fuguang-timeline-header">
          <span className="fuguang-timeline-header-icon">📔</span>
          <span className="fuguang-timeline-header-title">时光印记</span>
          <button className="fuguang-timeline-close" onClick={onClose}>✕</button>
        </div>
      )}

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
  );
};

export default FuguangTimeline;
