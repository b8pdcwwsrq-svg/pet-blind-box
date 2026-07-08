import { useState, useRef, useCallback } from "react";

interface ShareCardData {
  emoji: string;
  text: string;
  moodLabel: string;
  moodColor: string;
  imageData?: string;
}

const STYLES = [
  { id: "polaroid", label: "拍立得" },
  { id: "quote", label: "引用卡" },
  { id: "letter", label: "信纸" },
  { id: "stamp", label: "印章" },
  { id: "minimal", label: "极简" },
];

function PolaroidPreview({ emoji, text, moodLabel, moodColor, imageData }: ShareCardData) {
  return (
    <div className="sc-card" style={{ background: "#fff", borderRadius: 8, padding: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ borderRadius: 4, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${moodColor}14`, overflow: "hidden", position: "relative", background: imageData ? `url(${imageData}) center/cover no-repeat` : (moodColor + "0C") }}>
        {!imageData && <span style={{ fontSize: 32, lineHeight: 1.4 }}>{emoji}</span>}
        {!imageData && <span style={{ fontSize: 11, color: moodColor, marginTop: 4 }}>{moodLabel}</span>}
      </div>
      <p style={{ fontSize: 11, color: "#4a4540", lineHeight: 1.6, margin: "10px 0 6px", textAlign: "center" }}>{text}</p>
      <p style={{ fontSize: 8, color: "#c0b8a8", textAlign: "center", margin: 0 }}>今日拾光</p>
    </div>
  );
}

function QuotePreview({ text, moodLabel, moodColor }: ShareCardData) {
  return (
    <div className="sc-card" style={{ background: "#F5F2ED", borderRadius: 8, padding: "14px 12px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: moodColor }} />
      <p style={{ fontSize: 11, color: "#3a3530", lineHeight: 1.8, margin: "0 0 8px", fontStyle: "italic" }}>{"“"}{text}</p>
      <p style={{ fontSize: 9, color: "#8a7a60", textAlign: "right", margin: 0 }}>—— {moodLabel}</p>
      <p style={{ fontSize: 8, color: "#c0b8a8", textAlign: "center", margin: "10px 0 0" }}>今日拾光</p>
    </div>
  );
}

function LetterPreview({ text, moodLabel, moodColor }: ShareCardData) {
  return (
    <div className="sc-card" style={{ background: "#FDFAF5", borderRadius: 8, padding: "10px 12px", position: "relative" }}>
      <div style={{ background: moodColor + "10", borderRadius: "4px 4px 0 0", padding: "3px 0", textAlign: "center", margin: "-10px -12px 8px" }}>
        <span style={{ fontSize: 10, color: moodColor }}>{moodLabel}</span>
      </div>
      <div style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 17px, rgba(180,160,130,0.06) 17px, rgba(180,160,130,0.06) 18px)", padding: "0 2px" }}>
        <p style={{ fontSize: 11, color: "#4a4540", lineHeight: 1.7, margin: 0 }}>{text}</p>
      </div>
      <p style={{ fontSize: 8, color: "#c0b8a8", textAlign: "center", margin: "8px 0 0" }}>今日拾光</p>
    </div>
  );
}

function StampPreview({ text, moodLabel, moodColor }: ShareCardData) {
  return (
    <div className="sc-card" style={{ background: "#F8F6F0", borderRadius: 8, padding: 12, border: "1px solid rgba(180,160,130,0.12)" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ display: "inline-block", background: moodColor + "14", padding: "8px 12px", borderRadius: 4 }}>
          <span style={{ fontSize: 14, color: moodColor }}>{moodLabel}</span>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#4a4540", lineHeight: 1.6, margin: "0 0 6px", textAlign: "center" }}>{text}</p>
      <p style={{ fontSize: 8, color: "#c0b8a8", textAlign: "center", margin: 0 }}>今日拾光</p>
    </div>
  );
}

function MinimalPreview({ emoji, text, moodLabel, moodColor }: ShareCardData) {
  return (
    <div className="sc-card" style={{ background: "#F7F4ED", borderRadius: 8, padding: 16, textAlign: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: moodColor + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
      </div>
      <p style={{ fontSize: 9, color: moodColor, margin: "0 0 8px" }}>{moodLabel}</p>
      <p style={{ fontSize: 11, color: "#4a4540", lineHeight: 1.6, margin: "0 0 8px" }}>{text}</p>
      <p style={{ fontSize: 8, color: "#c0b8a8", margin: 0 }}>今日拾光</p>
    </div>
  );
}

// 全尺寸 Canvas 绘制（用于实际分享）
function renderFullCanvas(styleIdx: number, data: ShareCardData): Promise<Blob | null> {
  return new Promise((resolve) => {
    const { emoji, text, moodLabel, moodColor } = data;
    const canvas = document.createElement("canvas");
    const W = 540, H = 720;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.textBaseline = "top";

    const wrapText = (str: string, maxW: number, fontSize: number): string[] => {
      ctx.font = `${fontSize}px 'LXGW WenKai','STKaiti',serif`;
      const lines: string[] = [];
      let cur = "";
      for (const ch of str) {
        if (ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; }
        else { cur += ch; }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    // 拍立得
    if (styleIdx === 0) {
      ctx.fillStyle = "#FAFAFA"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#F0F0F0"; ctx.fillRect(12, 12, W-24, H-24);
      ctx.fillStyle = "#FAFAFA"; ctx.fillRect(20, 20, W-40, H-40);
      const px = 36, py = 36, pw = W-72, ph = 340;
      ctx.fillStyle = moodColor+"0C"; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = moodColor+"14"; ctx.lineWidth = 1;
      ctx.strokeRect(px+4, py+4, pw-8, ph-8);
      ctx.fillStyle = "#4a4540"; ctx.font = "42px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText(emoji, W/2, py+70);
      ctx.fillStyle = moodColor; ctx.font = "13px 'LXGW WenKai','STKaiti',serif";
      ctx.fillText(moodLabel, W/2, py+150);
      const lines = wrapText(text, pw-32, 13);
      ctx.fillStyle = "#4a4540"; ctx.font = "13px 'LXGW WenKai','STKaiti',serif";
      lines.forEach((l,i) => ctx.fillText(l, W/2, py+ph+36+i*22));
      ctx.fillStyle = "#c0b8a8"; ctx.font = "8px 'LXGW WenKai','STKaiti',serif";
      ctx.fillText("今日拾光", W/2, H-36);
    }
    // 引用卡
    else if (styleIdx === 1) {
      ctx.fillStyle = "#F5F2ED"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = moodColor; ctx.fillRect(0, 0, 6, H);
      ctx.fillStyle = moodColor+"12"; ctx.font = "64px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "left";
      ctx.fillText("「", 48, 80);
      const lines = wrapText(text, 380, 17);
      ctx.fillStyle = "#3a3530"; ctx.font = "17px 'LXGW WenKai','STKaiti',serif";
      lines.forEach((l,i) => ctx.fillText(l, 64, 180+i*32));
      const lastY = 180 + (lines.length-1)*32;
      ctx.fillStyle = "#8a7a60"; ctx.font = "11px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "right";
      ctx.fillText(`—— ${moodLabel}`, W-48, lastY+48);
      ctx.fillStyle = "#c0b8a8"; ctx.font = "8px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText("今日拾光", W/2, H-48);
    }
    // 信纸
    else if (styleIdx === 2) {
      ctx.fillStyle = "#FDFAF5"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(180,160,130,0.06)"; ctx.lineWidth = 0.5;
      for (let y=100; y<H-64; y+=30) { ctx.beginPath(); ctx.moveTo(44,y); ctx.lineTo(W-44,y); ctx.stroke(); }
      ctx.fillStyle = moodColor+"10"; ctx.fillRect(0, 32, W, 44);
      ctx.fillStyle = moodColor; ctx.font = "14px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText(moodLabel, W/2, 44);
      const lines = wrapText(text, 400, 15);
      ctx.fillStyle = "#4a4540"; ctx.font = "15px 'LXGW WenKai','STKaiti',serif";
      lines.forEach((l,i) => ctx.fillText(l, 48, 112+i*30));
      ctx.fillStyle = "#c0b8a8"; ctx.font = "8px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText("今日拾光", W/2, H-44);
    }
    // 印章
    else if (styleIdx === 3) {
      ctx.fillStyle = "#F8F6F0"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(180,160,130,0.12)"; ctx.lineWidth = 1;
      ctx.strokeRect(24, 24, W-48, H-48);
      ctx.fillStyle = moodColor+"14"; ctx.fillRect(W/2-36, 90, 72, 72);
      ctx.fillStyle = moodColor; ctx.font = "22px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText(moodLabel, W/2, 124);
      const lines = wrapText(text, 360, 16);
      ctx.fillStyle = "#4a4540"; ctx.font = "16px 'LXGW WenKai','STKaiti',serif";
      lines.forEach((l,i) => ctx.fillText(l, W/2, 220+i*30));
      ctx.fillStyle = "#c0b8a8"; ctx.font = "8px 'LXGW WenKai','STKaiti',serif";
      ctx.fillText("今日拾光", W/2, H-52);
    }
    // 极简
    else {
      ctx.fillStyle = "#F7F4ED"; ctx.fillRect(0, 0, W, H);
      ctx.beginPath(); ctx.arc(W/2, 140, 44, 0, Math.PI*2);
      ctx.fillStyle = moodColor+"15"; ctx.fill();
      ctx.beginPath(); ctx.arc(W/2, 140, 30, 0, Math.PI*2);
      ctx.fillStyle = moodColor+"25"; ctx.fill();
      ctx.fillStyle = "#4a4540"; ctx.font = "34px 'LXGW WenKai','STKaiti',serif"; ctx.textAlign = "center";
      ctx.fillText(emoji, W/2, 108);
      ctx.fillStyle = moodColor; ctx.font = "12px 'LXGW WenKai','STKaiti',serif";
      ctx.fillText(moodLabel, W/2, 196);
      const lines = wrapText(text, 380, 16);
      ctx.fillStyle = "#4a4540"; ctx.font = "16px 'LXGW WenKai','STKaiti',serif";
      lines.forEach((l,i) => ctx.fillText(l, W/2, 260+i*28));
      ctx.fillStyle = "#c0b8a8"; ctx.font = "8px 'LXGW WenKai','STKaiti',serif";
      ctx.fillText("今日拾光", W/2, H-48);
    }

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export default function ShareCard({ data, onClose }: { data: ShareCardData; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const [capturing, setCapturing] = useState(false);

  const doShare = useCallback(async () => {
    setCapturing(true);
    try {
      const blob = await renderFullCanvas(tab, data);
      if (!blob) return;
      const file = new File([blob], "jinrishiguang.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ title: "今日拾光", text: `今日拾光 · ${data.moodLabel}`, files: [file] });
      } else {
        const a = document.createElement("a");
        a.download = "jinrishiguang.png";
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch {}
    setCapturing(false);
  }, [tab, data]);

  const previews = [
    <PolaroidPreview key="p" {...data} />,
    <QuotePreview key="q" {...data} />,
    <LetterPreview key="l" {...data} />,
    <StampPreview key="s" {...data} />,
    <MinimalPreview key="m" {...data} />,
  ];

  return (
    <div className="fuguang-share-overlay" onClick={onClose}>
      <div className="fuguang-share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fuguang-share-close" onClick={onClose}>✕</button>

        {/* HTML 卡片预览 */}
        <div className="sc-preview">
          {previews[tab]}
        </div>

        {/* 样式标签 */}
        <div className="fuguang-share-tabs">
          {STYLES.map((s, i) => (
            <button key={s.id} className={`fuguang-share-tab ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
              {s.label}
            </button>
          ))}
        </div>

        {/* 分享按钮 */}
        <button className="fuguang-share-save-btn" onClick={doShare} disabled={capturing}>
          {capturing ? "生成中..." : "保存 / 分享"}
        </button>
      </div>
    </div>
  );
}
