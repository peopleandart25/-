import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { cropToJpeg, loadImage } from "../lib/imageFile";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

export interface ImageCropSpec {
  aspect: number;
  width: number;
  height: number;
  title: string;
  hint: string;
}

export const BANNER_CROP: ImageCropSpec = {
  aspect: 16 / 9,
  width: 1920,
  height: 1080,
  title: "메인 배너 미리보기",
  hint: "홈 화면 가로 비율(16:9)입니다. 드래그로 위치를 옮기고, 축소·확대로 구도를 맞추세요.",
};

export const PROFILE_CROP: ImageCropSpec = {
  aspect: 3 / 4,
  width: 900,
  height: 1200,
  title: "프로필 미리보기",
  hint: "목록·상세에 보이는 세로 비율(3:4)입니다. 얼굴이 잘리지 않게 맞춰 주세요.",
};

export const GALLERY_CROP: ImageCropSpec = {
  aspect: 4 / 5,
  width: 1080,
  height: 1350,
  title: "갤러리 미리보기",
  hint: "아티스트 갤러리 비율(4:5)입니다. 드래그와 확대로 구도를 맞추세요.",
};

interface ImageAdjustModalProps {
  src: string;
  spec: ImageCropSpec;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}

export function ImageAdjustModal({
  src,
  spec,
  onCancel,
  onConfirm,
}: ImageAdjustModalProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    loadImage(src)
      .then((loaded) => {
        if (active) setImage(loaded);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  const coverScale = () => {
    const frame = frameRef.current;
    if (!frame || !image) return 1;
    const { width, height } = frame.getBoundingClientRect();
    return Math.max(width / image.width, height / image.height);
  };

  const clampAxis = (pos: number, drawn: number, frame: number) => {
    if (drawn >= frame) {
      return Math.min(0, Math.max(frame - drawn, pos));
    }
    return Math.min(frame - drawn, Math.max(0, pos));
  };

  const clampPosition = (nextX: number, nextY: number, scale: number) => {
    const frame = frameRef.current;
    if (!frame || !image) return { x: nextX, y: nextY };
    const { width, height } = frame.getBoundingClientRect();
    return {
      x: clampAxis(nextX, image.width * scale, width),
      y: clampAxis(nextY, image.height * scale, height),
    };
  };

  useEffect(() => {
    if (!image) return;
    const frame = frameRef.current;
    if (!frame) return;
    const { width, height } = frame.getBoundingClientRect();
    const scale = Math.max(width / image.width, height / image.height);
    setZoom(1);
    setX((width - image.width * scale) / 2);
    setY((height - image.height * scale) / 2);
  }, [image]);

  const applyZoom = (rawZoom: number) => {
    const frame = frameRef.current;
    if (!frame || !image) return;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, rawZoom));
    const { width, height } = frame.getBoundingClientRect();
    const prev = coverScale() * zoom;
    const next = coverScale() * nextZoom;
    if (prev <= 0) {
      setZoom(nextZoom);
      return;
    }
    const cx = width / 2;
    const cy = height / 2;
    const ratio = next / prev;
    const clamped = clampPosition(
      cx - (cx - x) * ratio,
      cy - (cy - y) * ratio,
      next,
    );
    setZoom(nextZoom);
    setX(clamped.x);
    setY(clamped.y);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x, y, px: event.clientX, py: event.clientY };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const scale = coverScale() * zoom;
    const clamped = clampPosition(
      dragRef.current.x + (event.clientX - dragRef.current.px),
      dragRef.current.y + (event.clientY - dragRef.current.py),
      scale,
    );
    setX(clamped.x);
    setY(clamped.y);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const confirm = () => {
    const frame = frameRef.current;
    if (!frame || !image) return;
    setSaving(true);
    const { width, height } = frame.getBoundingClientRect();
    const dataUrl = cropToJpeg(
      image,
      { width, height },
      { x, y, scale: coverScale() * zoom },
      { width: spec.width, height: spec.height, quality: 0.82 },
    );
    onConfirm(dataUrl);
  };

  const scale = coverScale() * zoom;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-3xl bg-white p-5 shadow-2xl md:p-8">
        <p className="font-mono text-sm tracking-[0.18em] text-orange">
          IMAGE PREVIEW
        </p>
        <h2 className="mt-2 font-display text-3xl text-charcoal">{spec.title}</h2>
        <p className="mt-2 text-sm text-charcoal">{spec.hint}</p>

        <div
          className="mt-6 mx-auto w-full max-w-2xl overflow-hidden bg-ink"
          style={{ aspectRatio: String(spec.aspect) }}
        >
          <div
            ref={frameRef}
            className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {image ? (
              <img
                src={src}
                alt=""
                draggable={false}
                className="absolute max-w-none select-none"
                style={{
                  width: image.width * scale,
                  height: image.height * scale,
                  transform: `translate(${x}px, ${y}px)`,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-sm text-white/50">
                이미지를 불러오는 중
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-white/40"
              aria-hidden
            />
          </div>
        </div>

        <label className="mt-6 block">
          <span className="font-mono text-xs tracking-[0.16em] text-charcoal">
            축소 / 확대
          </span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            className="mt-2 w-full accent-orange"
          />
          <span className="mt-1 flex justify-between font-mono text-[10px] tracking-[0.12em] text-charcoal/60">
            <span>축소</span>
            <span>{Math.round(zoom * 100)}%</span>
            <span>확대</span>
          </span>
        </label>
        <p className="mt-2 text-sm text-charcoal/80">
          미리보기 안을 드래그하면 사진 위치를 옮길 수 있습니다. 축소하면 빈
          공간은 검정으로 채워집니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={confirm}
            disabled={!image || saving}
            className="bg-orange px-8 py-3 font-mono text-sm tracking-[0.18em] text-charcoal hover:bg-orange-deep disabled:opacity-40"
          >
            이 구도로 적용
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 font-mono text-sm tracking-[0.18em] text-charcoal hover:text-orange"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface AdjustImageButtonProps {
  src: string;
  spec: ImageCropSpec;
  onSaved: (dataUrl: string) => void;
  compact?: boolean;
}

export function AdjustImageButton({
  src,
  spec,
  onSaved,
  compact = false,
}: AdjustImageButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center border border-charcoal/20 font-mono tracking-[0.16em] text-charcoal transition-colors duration-300 hover:border-orange hover:text-orange ${
          compact
            ? "px-3 py-2 text-[10px]"
            : "px-4 py-2.5 text-[11px]"
        }`}
      >
        크기 조절
      </button>
      {open ? (
        <ImageAdjustModal
          src={src}
          spec={spec}
          onCancel={() => setOpen(false)}
          onConfirm={(dataUrl) => {
            setOpen(false);
            onSaved(dataUrl);
          }}
        />
      ) : null}
    </>
  );
}
