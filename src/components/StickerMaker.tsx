import { useState, useRef, useCallback, useEffect } from "react";
import { StickerData, loadStickersFromStorage, saveStickersToStorage } from "../utils/memoryUtils";

interface StickerMakerProps {
  sourceImage: string;
  onClose: () => void;
  onStickerSaved: (sticker: StickerData) => void;
}

export default function StickerMaker({ sourceImage, onClose, onStickerSaved }: StickerMakerProps) {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [stickerName, setStickerName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    removeBackground();
  }, [sourceImage]);

  const removeBackground = useCallback(async () => {
    setProcessing(true);
    setError("");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(sourceImage);
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (e: any) {
      console.error("抠图失败", e);
      setError("抠图失败了，可以试试手动裁剪或用原图作为贴纸");
      setProcessedUrl(sourceImage);
    } finally {
      setProcessing(false);
    }
  }, [sourceImage]);

  const handleRetry = useCallback(() => {
    if (processedUrl && processedUrl !== sourceImage) {
      URL.revokeObjectURL(processedUrl);
    }
    setProcessedUrl(null);
    removeBackground();
  }, [processedUrl, sourceImage, removeBackground]);

  // 保存贴纸 — 用 Blob 转 base64（保留透明通道）
  const handleSave = useCallback(() => {
    if (!processedUrl) return;
    const name = stickerName.trim() || `贴纸 ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;

    if (processedUrl.startsWith("blob:")) {
      fetch(processedUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const newSticker: StickerData = {
              id: Date.now(),
              name,
              dataUrl,
              createdAt: new Date().toISOString(),
            };
            const all = loadStickersFromStorage();
            all.unshift(newSticker);
            saveStickersToStorage(all);
            onStickerSaved(newSticker);
            onClose();
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => saveViaCanvas(name));
    } else {
      saveViaCanvas(name);
    }
  }, [processedUrl, stickerName, onStickerSaved, onClose]);

  // Canvas fallback + 白色转透明
  const saveViaCanvas = (name: string) => {
    const img = new Image();
    img.onload = () => {
      const MAX_SIZE = 400;
      let w = img.width;
      let h = img.height;
      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w > h) { h *= MAX_SIZE / w; w = MAX_SIZE; }
        else { w *= MAX_SIZE / h; h = MAX_SIZE; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 235 && d[i+1] > 235 && d[i+2] > 235) {
          d[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");

      const newSticker: StickerData = {
        id: Date.now(),
        name,
        dataUrl,
        createdAt: new Date().toISOString(),
      };
      const all = loadStickersFromStorage();
      all.unshift(newSticker);
      saveStickersToStorage(all);
      onStickerSaved(newSticker);
      onClose();
    };
    if (processedUrl) img.src = processedUrl;
  };

  const handleUseOriginal = useCallback(() => {
    setProcessedUrl(sourceImage);
    setProcessing(false);
  }, [sourceImage]);

  return (
    <div className="sticker-maker-overlay">
      <div className="sticker-maker-card">
        <div className="sticker-maker-header">
          <span>制作贴纸</span>
          <button className="sticker-maker-close" onClick={onClose}>✕</button>
        </div>
        <div className="sticker-maker-preview">
          {processing ? (
            <div className="sticker-maker-loading">
              <div className="sticker-maker-spinner" />
              <p>正在抠图中…</p>
              <p className="sticker-maker-hint">首次使用会下载AI模型，约40MB<br/>之后每次都是秒出</p>
            </div>
          ) : error ? (
            <div className="sticker-maker-error">
              <p>{error}</p>
              <div className="sticker-maker-actions">
                <button className="sticker-maker-btn" onClick={handleRetry}>重试</button>
                <button className="sticker-maker-btn sticker-maker-btn--secondary" onClick={handleUseOriginal}>
                  用原图当贴纸
                </button>
              </div>
            </div>
          ) : processedUrl ? (
            <>
              <div className="sticker-maker-result-wrap">
                <img src={processedUrl} alt="贴纸预览" className="sticker-maker-result" />
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <input
                className="sticker-maker-name-input"
                placeholder="给贴纸取个名字（可选）"
                value={stickerName}
                onChange={(e) => setStickerName(e.target.value)}
                maxLength={20}
              />
              <div className="sticker-maker-actions">
                <button className="sticker-maker-btn" onClick={handleSave}>保存到贴纸库</button>
                <button className="sticker-maker-btn sticker-maker-btn--secondary" onClick={handleRetry}>重新抠图</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <style>{`
        .sticker-maker-overlay {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          padding: 20px;
        }
        .sticker-maker-card {
          background: #faf8f5; border-radius: 20px;
          width: 100%; max-width: 360px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .sticker-maker-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px 0;
          font-size: 16px; font-weight: 600; color: #4a3f35;
        }
        .sticker-maker-close {
          width: 28px; height: 28px; border-radius: 50%;
          border: none; background: rgba(180,160,130,0.1);
          font-size: 14px; cursor: pointer; color: #8a7a6a;
          display: flex; align-items: center; justify-content: center;
        }
        .sticker-maker-preview { padding: 16px 20px 20px; }
        .sticker-maker-loading { text-align: center; padding: 40px 0; }
        .sticker-maker-spinner {
          width: 36px; height: 36px; border: 3px solid #e0d5c5;
          border-top-color: #D87850; border-radius: 50%;
          animation: sm-spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes sm-spin { to { transform: rotate(360deg); } }
        .sticker-maker-hint { font-size: 12px; color: #b0a090; margin-top: 8px; line-height: 1.5; }
        .sticker-maker-error { text-align: center; padding: 20px 0; color: #c07050; font-size: 14px; }
        .sticker-maker-result-wrap {
          display: flex; align-items: center; justify-content: center;
          min-height: 120px; padding: 12px;
          background: repeating-conic-gradient(#e8e2d8 0% 25%, transparent 0% 50%) 0 0 / 20px 20px;
          border-radius: 12px; margin-bottom: 12px;
        }
        .sticker-maker-result {
          max-width: 200px; max-height: 200px;
          object-fit: contain; display: block;
        }
        .sticker-maker-name-input {
          width: 100%; padding: 10px 14px; border: 1px solid #e0d5c5;
          border-radius: 10px; font-size: 14px; background: #fff;
          box-sizing: border-box; margin-bottom: 12px;
          font-family: inherit;
          outline: none;
        }
        .sticker-maker-name-input:focus { border-color: #D87850; }
        .sticker-maker-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .sticker-maker-btn {
          flex: 1; padding: 10px 16px; border: none; border-radius: 10px;
          background: #D87850; color: #fff; font-size: 14px; cursor: pointer;
          font-family: inherit; min-width: 100px;
        }
        .sticker-maker-btn--secondary {
          background: #e8e2d8; color: #6a5a4a;
        }
      `}</style>
    </div>
  );
}
