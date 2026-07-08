import { useState } from "react";
import { StickerData, loadStickersFromStorage, saveStickersToStorage } from "../utils/memoryUtils";

interface StickerPickerProps {
  onSelect: (sticker: StickerData) => void;
  onClose: () => void;
  /** 照片叠加模式：选择后不关闭，可以继续选别的贴纸 */
  overlayMode?: boolean;
}

export default function StickerPicker({ onSelect, onClose, overlayMode }: StickerPickerProps) {
  const [stickers, setStickers] = useState<StickerData[]>(() => loadStickersFromStorage());

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = stickers.filter((s) => s.id !== id);
    setStickers(updated);
    saveStickersToStorage(updated);
  };

  const handleSelect = (s: StickerData) => {
    onSelect(s);
    if (!overlayMode) onClose();
  };

  return (
    <div className="sticker-picker-overlay">
      <div className="sticker-picker-card">
        <div className="sticker-picker-header">
          <span>{overlayMode ? "选贴纸叠到照片上" : "我的贴纸库"}</span>
          <button className="sticker-picker-close" onClick={onClose}>✕</button>
        </div>

        {stickers.length === 0 ? (
          <div className="sticker-picker-empty">
            <p>还没有贴纸</p>
            <p className="sticker-picker-empty-hint">拍照后可以转为贴纸收藏</p>
          </div>
        ) : (
          <div className="sticker-picker-grid">
            {stickers.map((s) => (
              <div key={s.id} className="sticker-picker-item" onClick={() => handleSelect(s)}>
                <div className="sticker-picker-item-bg">
                  <img src={s.dataUrl} alt={s.name} className="sticker-picker-item-img" />
                </div>
                <div className="sticker-picker-item-name">{s.name}</div>
                <button
                  className="sticker-picker-item-del"
                  onClick={(e) => handleDelete(e, s.id)}
                  title="删除"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .sticker-picker-overlay {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: flex-end; justify-content: center;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
        }
        .sticker-picker-card {
          background: #faf8f5; border-radius: 20px 20px 0 0;
          width: 100%; max-width: 400px; max-height: 60vh;
          overflow-y: auto;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        }
        .sticker-picker-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          font-size: 16px; font-weight: 600; color: #4a3f35;
          border-bottom: 1px solid #eee8e0;
          position: sticky; top: 0; background: #faf8f5; z-index: 1;
        }
        .sticker-picker-close {
          width: 28px; height: 28px; border-radius: 50%;
          border: none; background: rgba(180,160,130,0.1);
          font-size: 14px; cursor: pointer; color: #8a7a6a;
          display: flex; align-items: center; justify-content: center;
        }
        .sticker-picker-empty {
          text-align: center; padding: 40px 20px;
          color: #b0a090; font-size: 14px;
        }
        .sticker-picker-empty-hint { font-size: 12px; margin-top: 6px; color: #c0b5a5; }
        .sticker-picker-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; padding: 16px 20px 20px;
        }
        .sticker-picker-item {
          position: relative; cursor: pointer; text-align: center;
        }
        .sticker-picker-item-bg {
          aspect-ratio: 1; border-radius: 12px;
          background: repeating-conic-gradient(#e8e2d8 0% 25%, transparent 0% 50%) 0 0 / 14px 14px;
          display: flex; align-items: center; justify-content: center;
          padding: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .sticker-picker-item-bg:active { transform: scale(0.93); }
        .sticker-picker-item-img {
          max-width: 100%; max-height: 100%;
          object-fit: contain; display: block;
        }
        .sticker-picker-item-name {
          font-size: 11px; color: #8a7a6a; margin-top: 4px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .sticker-picker-item-del {
          position: absolute; top: -4px; right: -4px;
          width: 18px; height: 18px; border-radius: 50%;
          border: none; background: rgba(200,80,60,0.8); color: #fff;
          font-size: 10px; cursor: pointer; opacity: 0;
          transition: opacity 0.15s; line-height: 18px; padding: 0;
        }
        .sticker-picker-item:hover .sticker-picker-item-del { opacity: 1; }
      `}</style>
    </div>
  );
}
