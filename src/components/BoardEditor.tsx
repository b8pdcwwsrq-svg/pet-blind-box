import { useState, useRef, useCallback } from "react";
import { loadStickersFromStorage } from "../utils/memoryUtils";
import StickerPicker from "./StickerPicker";
import StickerMaker from "./StickerMaker";

export type BoardElement = {
  id: number; type: "image" | "sticker" | "text";
  dataUrl?: string; content?: string;
  x: number; y: number; w?: number; h?: number;
};

interface BoardEditorProps {
  onSave: (title: string, compositeImage: string) => void;
  onClose: () => void;
}

export default function BoardEditor({ onSave, onClose }: BoardEditorProps) {
  const [title, setTitle] = useState("");
  const [elements, setElements] = useState<BoardElement[]>([]);
  const elsRef = useRef<BoardElement[]>([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showStickerMaker, setShowStickerMaker] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const genId = () => nextId.current++;

  const updateEls = useCallback((fn: (prev: BoardElement[]) => BoardElement[]) => {
    setElements((prev) => { const next = fn(prev); elsRef.current = next; return next; });
  }, []);

  // 拖拽
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const container = (e.target as HTMLElement).closest("[data-el-id]") as HTMLElement | null;
    if (!container) return;
    const id = parseInt(container.getAttribute("data-el-id") || "0");
    const el = elsRef.current.find((el) => el.id === id);
    if (!el) return;
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const origX = el.x, origY = el.y;
    const onMove = (ev: PointerEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      container.style.left = Math.max(0, Math.min(100, origX + ((ev.clientX - startX) / rect.width) * 100)) + "%";
      container.style.top = Math.max(0, Math.min(100, origY + ((ev.clientY - startY) / rect.height) * 100)) + "%";
    };
    const onUp = () => {
      const left = parseFloat(container.style.left);
      const top = parseFloat(container.style.top);
      if (!isNaN(left) && !isNaN(top)) {
        updateEls((prev) => prev.map((e) => e.id === id ? { ...e, x: left, y: top } : e));
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [updateEls]);

  // 点击空白添加文字
  const handleBoardClick = useCallback((e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-el-id]")) return;
    if (t.closest("[data-empty]") || t === boardRef.current) {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const id = genId();
      updateEls((prev) => [...prev, { id, type: "text", content: "", x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }]);
    }
  }, [updateEls]);

  const handlePhoto = useCallback(() => cameraRef.current?.click(), []);
  const handlePhotoTaken = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        const mw = 800, mh = 600;
        let w = img.width, h = img.height;
        if (w > h) { if (w > mw) { h *= mw / w; w = mw; } }
        else { if (h > mh) { w *= mh / h; h = mh; } }
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        setPendingPhoto(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const addPhoto = useCallback(() => {
    if (!pendingPhoto) return;
    updateEls((prev) => {
      if (prev.filter((el) => el.type === "image").length >= 2) return prev;
      const cnt = prev.filter((el) => el.type === "image").length;
      return [...prev, { id: genId(), type: "image", dataUrl: pendingPhoto, x: 5 + cnt * 40, y: 5, w: 35 }];
    });
    setPendingPhoto(null);
  }, [pendingPhoto, updateEls]);

  // 保存 — html2canvas 截图
  const handleSave = useCallback(async () => {
    if (elsRef.current.length === 0 && !title.trim()) return;
    const boardEl = boardRef.current;
    if (!boardEl) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const cvs = await html2canvas(boardEl, { backgroundColor: "#faf8f5", scale: 2, useCORS: true, logging: false });
      onSave(title, cvs.toDataURL("image/jpeg", 0.9));
    } catch {
      onSave(title, "");
    }
  }, [title, onSave]);

  const allStickers = loadStickersFromStorage();

  return (
    <div className="fuguang-letter" style={{ position: "relative" }}>
      <button onClick={onClose}
        style={{ position: "absolute", top: "4px", right: "4px", width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "rgba(180,160,130,0.1)", fontSize: "13px", lineHeight: "24px", textAlign: "center", cursor: "pointer", color: "#b0a090", zIndex: 10, padding: 0, fontFamily: "inherit" }}
        aria-label="关闭">✕</button>
      <input className="fuguang-letter-title" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />

      <div ref={boardRef} className="board-area"
        onClick={handleBoardClick}
        onPointerDown={handlePointerDown}
        style={{ position: "relative", width: "100%", minHeight: 300, background: "#faf8f5", borderRadius: 12, border: "1px dashed #e0d5c5", marginBottom: 8, overflow: "hidden" }}
      >
        {elements.map((el) => (
          <div key={el.id} data-el-id={el.id}
            style={{ position: "absolute", left: `${el.x}%`, top: `${el.y}%`, cursor: "grab", zIndex: 10, touchAction: "none" }}
          >
            {el.type === "image" && el.dataUrl ? (
              <img src={el.dataUrl} alt="" draggable={false}
                style={{ width: `${el.w || 30}vw`, maxWidth: 180, height: "auto", borderRadius: 8, display: "block", pointerEvents: "none" }}
              />
            ) : el.type === "sticker" && el.dataUrl ? (
              <img src={el.dataUrl} alt="" draggable={false}
                style={{ width: `${el.w || 60}px`, height: `${el.h || 60}px`, objectFit: "contain", pointerEvents: "none", borderRadius: 6, outline: "3px solid #fff", outlineOffset: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
            ) : el.type === "text" ? (
              <div contentEditable suppressContentEditableWarning
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 15, color: "#4a3f35", fontFamily: "inherit", lineHeight: 1.6, padding: "4px 8px", borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", background: "rgba(255,255,255,0.3)", minHeight: 24, minWidth: 60, outline: "none", cursor: "text" }}>
                {el.content || ""}
              </div>
            ) : null}
          </div>
        ))}
        {elements.length === 0 && (
          <p data-empty="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#c0b5a5", fontSize: 13, pointerEvents: "none", textAlign: "center", lineHeight: 1.8 }}>
            点击空白添加文字<br />📷 拍照 &nbsp; 🎀 贴纸
          </p>
        )}
      </div>

      <div className="fuguang-letter-foot" style={{ alignItems: "center" }}>
        <button className="fuguang-letter-camera" onClick={handlePhoto} aria-label="拍照">📷</button>
        {allStickers.length > 0 && <button className="fuguang-letter-sticker-btn" onClick={() => setShowStickerPicker(true)} aria-label="贴纸">🎀</button>}
        <button className="fuguang-letter-submit" onClick={handleSave} disabled={elements.length === 0 && !title.trim()}>存入时光</button>
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhotoTaken} />

      {pendingPhoto && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ background: "#faf8f5", borderRadius: 20, padding: 24, width: "100%", maxWidth: 320, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <p style={{ fontSize: 15, color: "#4a3f35", marginBottom: 16 }}>要把这张照片转成贴纸吗？</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => { addPhoto(); }} style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 10, background: "#e8e2d8", color: "#6a5a4a", fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>作为照片</button>
              <button onClick={() => setShowStickerMaker(true)} style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 10, background: "#D87850", color: "#fff", fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>转贴纸</button>
            </div>
            <button onClick={() => setPendingPhoto(null)} style={{ marginTop: 10, border: "none", background: "none", color: "#b0a090", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>取消</button>
          </div>
        </div>
      )}

      {showStickerPicker && (
        <StickerPicker overlayMode
          onClose={() => setShowStickerPicker(false)}
          onSelect={(sticker) => {
            updateEls((prev) => {
              const cnt = prev.filter((el) => el.type === "sticker").length;
              return [...prev, { id: genId(), type: "sticker", dataUrl: sticker.dataUrl, x: 10 + cnt * 15, y: 10 + cnt * 15, w: 60, h: 60 }];
            });
          }}
        />
      )}

      {showStickerMaker && pendingPhoto && (
        <StickerMaker
          sourceImage={pendingPhoto}
          onClose={() => setShowStickerMaker(false)}
          onStickerSaved={(sticker) => {
            updateEls((prev) => [...prev, { id: genId(), type: "sticker", dataUrl: sticker.dataUrl, x: 30, y: 30, w: 60, h: 60 }]);
            setPendingPhoto(null);
            setShowStickerMaker(false);
          }}
        />
      )}
    </div>
  );
}
