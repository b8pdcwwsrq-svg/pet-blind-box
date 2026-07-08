import { useMemo, useCallback } from "react";
import type { MemoryEntry } from "../utils/memoryUtils";

interface MoodHeatmapProps {
  entries: MemoryEntry[];
  month: number;
  year: number;
  onDayClick?: (dateStr: string) => void;
}

export default function MoodHeatmap({ entries, month, year, onDayClick }: MoodHeatmapProps) {
  const dayData = useMemo(() => {
    const countMap = new Map<number, { count: number; colors: string[] }>();
    entries.forEach((e) => {
      if (e.month !== month) return;
      const d = parseInt(e.date.split("月")[1].replace("日", ""));
      if (!e.moodColor) return;
      if (!countMap.has(d)) countMap.set(d, { count: 0, colors: [] });
      const rec = countMap.get(d)!;
      rec.count++;
      rec.colors.push(e.moodColor);
    });
    // 计算颜色深浅等级（0-4）
    const result = new Map<number, { level: number; color: string; count: number }>();
    const maxCount = Math.max(1, ...Array.from(countMap.values()).map((v) => v.count));
    countMap.forEach((rec, day) => {
      const level = Math.min(4, Math.ceil((rec.count / maxCount) * 4));
      const baseColor = rec.colors[rec.colors.length - 1] || "#D87850";
      result.set(day, { level, color: baseColor, count: rec.count });
    });
    return result;
  }, [entries, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
  const today = now.getDate();
  const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];

  const handleDayClick = useCallback((day: number) => {
    onDayClick?.(`${month}月${day}日`);
  }, [month, onDayClick]);

  // 根据 level 生成不同透明度的颜色 — 模仿 GitHub 热力图
  const getCellStyle = (level: number, color: string) => {
    const opacityMap = [0, 0.15, 0.35, 0.55, 0.8];
    const op = opacityMap[level];
    if (level === 0) return { backgroundColor: "rgba(180,160,130,0.04)" };
    return { backgroundColor: color, opacity: op };
  };

  return (
    <div className="fuguang-heatmap">
      <p className="fuguang-heatmap-title">本月情绪日历</p>
      <div className="fuguang-heatmap-grid">
        {weekLabels.map((w) => (<span key={w} className="fuguang-heatmap-weekday">{w}</span>))}
        {Array.from({ length: firstDay }).map((_, i) => (<div key={`e-${i}`} className="fuguang-heatmap-cell fuguang-heatmap-cell--empty" />))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const data = dayData.get(day);
          const level = data?.level || 0;
          const color = data?.color || "#D87850";
          return (
            <div key={day}
              className={`fuguang-heatmap-cell ${level > 0 ? "fuguang-heatmap-cell--filled" : "fuguang-heatmap-cell--blank"} ${isCurrentMonth && day === today ? "fuguang-heatmap-cell--today" : ""} ${data ? "fuguang-heatmap-cell--clickable" : ""}`}
              style={getCellStyle(level, color)}
              title={`${month}月${day}日${data ? ` · ${data.count}条记录` : ""}`}
              onClick={data ? () => handleDayClick(day) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
