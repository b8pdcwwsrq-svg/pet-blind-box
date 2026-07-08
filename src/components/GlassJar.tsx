import React, { useMemo, useRef, useCallback } from "react";
import type { MemoryEntry } from "../utils/memoryUtils";

interface GlassJarProps {
  entries: MemoryEntry[];
  month: number;
  year: number;
  onDayClick?: (dateStr: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function GlassJar({ entries, month, year, onDayClick, onPrevMonth, onNextMonth, hasPrev, hasNext }: GlassJarProps) {
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

    // 阴影
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(cx, jbottom + 6, jw * 0.1, cx, jbottom, jw * 0.8);
    shadowGrad.addColorStop(0, "rgba(180,160,140,0.08)");
    shadowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, jtop, W, H);
    ctx.restore();

    // 罐身
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

    // 萤火虫
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
        <button className={`fuguang-glass-jar-arrow ${!hasPrev ? "disabled" : ""}`} onClick={onPrevMonth} disabled={!hasPrev} aria-label="上个月">←</button>
        <p className="fuguang-glass-jar-label">{month}月情绪收集罐</p>
        <button className={`fuguang-glass-jar-arrow ${!hasNext ? "disabled" : ""}`} onClick={onNextMonth} disabled={!hasNext} aria-label="下个月">→</button>
      </div>
      <canvas ref={canvasRef} className="fuguang-glass-jar-canvas" onClick={handleClick} />
    </div>
  );
}
