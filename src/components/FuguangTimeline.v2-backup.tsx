import React, { useMemo } from "react";
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

const FuguangTimeline: React.FC<FuguangTimelineProps> = ({
  entries,
  onClose,
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
        {dateGroups.map((group, gIdx) => (
          <div key={group.date} className="fuguang-timeline-day-group">
            {/* 左对齐日期标签 */}
            <div className="fuguang-timeline-date-label">
              {formatDateLabel(group.date)}
            </div>

            {group.entries.map((entry, eIdx) => (
              <motion.div
                key={entry.id}
                className="fuguang-timeline-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: gIdx * 0.04 + eIdx * 0.02,
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                {/* 头像 */}
                <div
                  className="fuguang-timeline-avatar"
                  style={{
                    background: entry.moodColor
                      ? `linear-gradient(135deg, ${entry.moodColor}22, ${entry.moodColor}44)`
                      : "linear-gradient(135deg, #F5E6D3, #EDE0D4)",
                  }}
                >
                  <span className="fuguang-timeline-avatar-emoji">
                    {entry.emoji}
                  </span>
                </div>

                {/* 内容 */}
                <div className="fuguang-timeline-card-body">
                  {/* 关键词 */}
                  <span className="fuguang-timeline-card-keyword">
                    {entry.keyword}
                  </span>

                  {/* 正文 */}
                  <p className="fuguang-timeline-card-text">
                    {entry.eventText}
                  </p>

                  {/* 照片 */}
                  {entry.imageData && (
                    <div className="fuguang-timeline-card-image">
                      <img
                        src={entry.imageData}
                        alt={entry.keyword}
                        className="fuguang-timeline-card-img"
                      />
                    </div>
                  )}

                  {/* 底部：情绪标签 + 回应 + 时间 */}
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
                    <span className="fuguang-timeline-card-time">
                      {entry.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuguangTimeline;
