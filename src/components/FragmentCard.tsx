import { useState, useCallback } from "react";
import {
  FragmentData,
  StickerData,
  loadStickersFromStorage,
  getTodayFragmentWritten,
  markTodayFragmentWritten,
  saveUserFragments,
  loadUserFragments,
} from "../utils/memoryUtils";

interface FragmentCardProps {
  fragment: FragmentData;
  /** 关闭卡片 */
  onClose: () => void;
  /** 写碎片成功回调 */
  onFragmentWritten: () => void;
}

export default function FragmentCard({ fragment, onClose, onFragmentWritten }: FragmentCardProps) {
  const [mode, setMode] = useState<"show" | "write">("show");
  const [text, setText] = useState("");
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<StickerData | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // 获取贴纸库
  const allStickers = loadStickersFromStorage();

  // "也留一片" — 进入写模式
  const handleAlsoLeave = useCallback(() => {
    if (getTodayFragmentWritten()) {
      return; // 今天已写过，不应该走到这里
    }
    setMode("write");
  }, []);

  // 选择贴纸
  const handleSelectSticker = useCallback((s: StickerData) => {
    setSelectedSticker((prev) => (prev?.id === s.id ? null : s));
  }, []);

  // 放下碎片
  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && !selectedSticker) return;
    const now = new Date();
    const newFragment: FragmentData = {
      id: Date.now(),
      text: trimmed,
      stickerId: selectedSticker?.id,
      date: `${now.getMonth() + 1}月${now.getDate()}日`,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      isPreset: false,
    };
    const all = loadUserFragments();
    all.unshift(newFragment);
    saveUserFragments(all);
    markTodayFragmentWritten();
    setSubmitted(true);
    onFragmentWritten();
  }, [text, selectedSticker, onFragmentWritten]);

  const todayWritten = getTodayFragmentWritten();

  return (
    <div className="fragment-card-overlay" onClick={onClose}>
      <div className="fragment-card" onClick={(e) => e.stopPropagation()}>
        {mode === "show" && !submitted && (
          <div className="fragment-card-show">
            <div className="fragment-card-label">🪶 一片碎片</div>
            <div className="fragment-card-text">{fragment.text}</div>
            <div className="fragment-card-actions">
              {!todayWritten && (
                <button className="fragment-card-btn" onClick={handleAlsoLeave}>
                  也留一片
                </button>
              )}
              <button className="fragment-card-btn fragment-card-btn--ghost" onClick={onClose}>
                收下
              </button>
            </div>
            {todayWritten && (
              <div className="fragment-card-today-done">
                今天的光已经拾过啦，明天再来
              </div>
            )}
          </div>
        )}

        {mode === "write" && !submitted && (
          <div className="fragment-card-write">
            <div className="fragment-card-label">🪶 也留一片</div>
            <textarea
              className="fragment-card-input"
              placeholder="今天想留下一句什么？"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 50))}
              rows={3}
              autoFocus
            />
            <div className="fragment-card-char-count">{text.length}/50</div>

            {/* 贴纸按钮 */}
            {allStickers.length > 0 && (
              <div className="fragment-card-sticker-section">
                <button
                  className={`fragment-card-sticker-btn ${selectedSticker ? "has" : ""}`}
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                >
                  🎀 {selectedSticker ? "已选贴纸" : "加张贴纸"}
                </button>
                {selectedSticker && (
                  <div className="fragment-card-selected-sticker">
                    <img src={selectedSticker.dataUrl} alt={selectedSticker.name} />
                    <button onClick={() => setSelectedSticker(null)}>✕</button>
                  </div>
                )}
              </div>
            )}

            {showStickerPicker && (
              <div className="fragment-card-sticker-grid">
                {allStickers.map((s) => (
                  <div
                    key={s.id}
                    className={`fragment-card-sticker-option ${selectedSticker?.id === s.id ? "selected" : ""}`}
                    onClick={() => handleSelectSticker(s)}
                  >
                    <div className="fragment-card-sticker-option-bg">
                      <img src={s.dataUrl} alt={s.name} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="fragment-card-actions">
              <button
                className="fragment-card-btn"
                onClick={handleSubmit}
                disabled={!text.trim() && !selectedSticker}
              >
                放下
              </button>
              <button className="fragment-card-btn fragment-card-btn--ghost" onClick={() => setMode("show")}>
                回去看看
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="fragment-card-done">
            <div className="fragment-card-done-icon">🪶</div>
            <div className="fragment-card-done-text">已拾取一片光</div>
            <button className="fragment-card-btn" onClick={onClose}>
              好的
            </button>
          </div>
        )}
      </div>
      <style>{`
        .fragment-card-overlay {
          position: fixed; inset: 0; z-index: 250;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
          padding: 24px;
        }
        .fragment-card {
          background: #faf8f5; border-radius: 20px;
          width: 100%; max-width: 360px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden;
          padding: 24px 20px;
        }
        .fragment-card-label {
          font-size: 13px; color: #b0a090; margin-bottom: 12px;
          letter-spacing: 0.06em;
        }
        .fragment-card-text {
          font-size: 17px; line-height: 1.7; color: #4a3f35;
          margin-bottom: 20px; font-weight: 370;
          letter-spacing: 0.03em;
        }
        .fragment-card-actions {
          display: flex; gap: 10px; margin-top: 4px;
        }
        .fragment-card-btn {
          flex: 1; padding: 10px 16px; border: none; border-radius: 10px;
          background: #D87850; color: #fff; font-size: 14px; cursor: pointer;
          font-family: inherit;
        }
        .fragment-card-btn:disabled { opacity: 0.3; cursor: default; }
        .fragment-card-btn--ghost {
          background: #e8e2d8; color: #6a5a4a;
        }
        .fragment-card-today-done {
          font-size: 12px; color: #c0b5a5; margin-top: 12px;
          text-align: center;
        }
        .fragment-card-write .fragment-card-input {
          width: 100%; padding: 14px; border: 1px solid #e0d5c5;
          border-radius: 12px; font-size: 15px; background: #fff;
          box-sizing: border-box; font-family: inherit; resize: none;
          line-height: 1.6; color: #4a3f35;
          outline: none; min-height: 80px;
        }
        .fragment-card-write .fragment-card-input:focus {
          border-color: #D87850;
        }
        .fragment-card-char-count {
          text-align: right; font-size: 11px; color: #c0b5a5;
          margin-top: 4px; margin-bottom: 12px;
        }
        .fragment-card-sticker-section {
          margin-bottom: 12px;
        }
        .fragment-card-sticker-btn {
          padding: 6px 14px; border-radius: 8px; border: 1px solid #e0d5c5;
          background: #fff; font-size: 13px; cursor: pointer;
          font-family: inherit; color: #6a5a4a;
        }
        .fragment-card-sticker-btn.has { border-color: #D87850; color: #D87850; }
        .fragment-card-selected-sticker {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 8px; padding: 4px 8px 4px 4px;
          background: #fff; border-radius: 8px; border: 1px solid #e0d5c5;
        }
        .fragment-card-selected-sticker img {
          width: 32px; height: 32px; object-fit: contain;
        }
        .fragment-card-selected-sticker button {
          border: none; background: none; cursor: pointer; font-size: 12px;
          color: #b0a090; padding: 0;
        }
        .fragment-card-sticker-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 8px; margin-bottom: 12px; padding: 10px;
          background: #f5f0ea; border-radius: 10px;
        }
        .fragment-card-sticker-option {
          aspect-ratio: 1; border-radius: 8px; cursor: pointer;
          background: repeating-conic-gradient(#e8e2d8 0% 25%, transparent 0% 50%) 0 0 / 10px 10px;
          display: flex; align-items: center; justify-content: center;
          padding: 4px; border: 2px solid transparent; transition: border-color 0.15s;
        }
        .fragment-card-sticker-option.selected { border-color: #D87850; }
        .fragment-card-sticker-option img { max-width: 100%; max-height: 100%; display: block; }
        .fragment-card-done {
          text-align: center; padding: 20px 0;
        }
        .fragment-card-done-icon { font-size: 36px; margin-bottom: 8px; }
        .fragment-card-done-text {
          font-size: 16px; color: #4a3f35; margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
