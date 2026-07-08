import { useState, useMemo } from "react";
import { generateWeekReport, generateMonthReport, generatePoem } from "../utils/memoryUtils";
import type { MemoryEntry } from "../utils/memoryUtils";

// 根据一周的情绪走向生成一段温暖的信
function generateLetter(report: ReturnType<typeof generateWeekReport>): string[] {
  const { totalCount, moodDistribution, topKeywords } = report;
  if (totalCount === 0) return ["这一周，你在认真地生活。"];

  const lines: string[] = [];
  const sorted = [...moodDistribution].filter((m) => m.count > 0).sort((a, b) => b.count - a.count);
  const top = sorted[0];
  const second = sorted[1];

  if (top) {
    if (top.pct >= 60) lines.push(`这一周，${top.label}是你最常有的感受。`);
    else if (top.pct >= 40) lines.push(`这一周，你时常感到${top.label}，也有一些别的情绪。`);
    else lines.push(`这一周，你的情绪像四月的天气，有晴有雨。`);
  }

  if (totalCount >= 5) {
    const weekDays = Math.min(7, totalCount);
    if (weekDays >= 5) lines.push(`你几乎每天都在记录，这本身就是一种温柔的坚持。`);
    else if (weekDays >= 3) lines.push(`你有${weekDays}天都在记录，哪怕只是几句话。`);
  } else if (totalCount <= 2) {
    lines.push(`记录不多也没关系，安静的一周也是好的一周。`);
  }

  if (second && second.count > 0) {
    lines.push(`${second.label}的时刻也值得被记住。`);
  }

  if (topKeywords.length > 0) {
    const kw = topKeywords[0];
    lines.push(`这周你多次想起"${kw.keyword}"。`);
  }

  // 结尾句
  const endings = [
    "周末到了，好好休息。",
    "新的一周，继续感受就好。",
    "你不需要好起来，只需要感觉到。",
    "人生嘛，重在体验。",
    "每一次记录，都是对自己的温柔。",
  ];
  lines.push(endings[Math.floor(Math.random() * endings.length)]);

  return lines;
}

export default function MoodReport({ entries, mode }: { entries: MemoryEntry[]; mode: "week" | "month" }) {
  const report = useMemo(() => (mode === "week" ? generateWeekReport(entries) : generateMonthReport(entries)), [entries, mode]);
  const letterLines = useMemo(() => generateLetter(report), [report]);
  const [expanded, setExpanded] = useState(false);
  if (report.totalCount === 0) return null;

  return (
    <div className={`fuguang-report ${expanded ? "fuguang-report--expanded" : ""}`}>
      <div className="fuguang-report-header" onClick={() => setExpanded(!expanded)}>
        <span className="fuguang-report-label">{mode === "week" ? "本周来信" : "本月来信"}</span>
        <span className="fuguang-report-count">{report.totalCount} 段记录</span>
        <span className="fuguang-report-toggle">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* 折叠时只显示第一行 */}
      <p className="fuguang-report-poem">"{letterLines[0]}"</p>

      {expanded && (
        <div className="fuguang-report-body">
          <div className="fuguang-report-letter">
            {letterLines.map((line, i) => (
              <p key={i} className="fuguang-report-letter-line">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
