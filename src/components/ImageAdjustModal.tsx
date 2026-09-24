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
  showMobilePreview?: boolean;
}

export const BANNER_CROP: ImageCropSpec = {
  aspect: 16 / 9,
  width: 1920,
  height: 1080,
  title: "메인 배너 미리보기",
  hint: "왼쪽은 PC 홈 화면(16:9), 오른쪽은 휴대폰 풀화면입니다. 드래그와 축소·확대로 구도를 맞추세요.",
  showMobilePreview: true,
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

  const [frameSize, setFrameSize] = useState({ width: 1, height: 1 });

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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setFrameSize({ width: rect.width, height: rect.height });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [image]);

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
  const phoneWidth = 160;
  const phoneHeight = phoneWidth * (19.5 / 9);
  const phoneInnerWidth = phoneHeight * (16 / 9);
  const phoneRatio =
    frameSize.width > 8 ? phoneInnerWidth / frameSize.width : 0;
  const showMobile = Boolean(spec.showMobilePreview);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/55 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[100dvh] w-full flex-col overflow-y-auto bg-white p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl md:max-h-[92vh] md:p-8 ${
          showMobile ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <p className="font-mono text-sm tracking-[0.18em] text-orange">
          IMAGE PREVIEW
        </p>
        <h2 className="mt-2 font-display text-2xl text-charcoal md:text-3xl">
          {spec.title}
        </h2>
        <p className="mt-2 text-sm text-charcoal">{spec.hint}</p>

        <div
          className={`mt-4 md:mt-6 ${
            showMobile
              ? "flex flex-col items-center gap-6 lg:flex-row lg:items-start"
              : ""
          }`}
        >
          <div className="min-w-0 w-full flex-1">
            {showMobile ? (
              <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-charcoal">
                PC 화면 · 16:9
              </p>
            ) : null}
            <div
              className="mx-auto w-full max-w-2xl overflow-hidden bg-ink"
              style={{
                aspectRatio: String(spec.aspect),
                maxHeight: "min(42dvh, 420px)",
              }}
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
          </div>

          {showMobile ? (
            <div className="shrink-0">
              <p className="mb-2 text-center font-mono text-[10px] tracking-[0.16em] text-charcoal">
                모바일 화면
              </p>
              <div
                className="relative rounded-[2rem] border-[10px] border-charcoal bg-charcoal shadow-xl"
                style={{ width: phoneWidth + 20 }}
              >
                <div className="mx-auto mt-1 h-4 w-16 rounded-full bg-black/50" />
                <div
                  className="relative mx-auto overflow-hidden bg-ink"
                  style={{ width: phoneWidth, height: phoneHeight }}
                >
                  <div
                    className="absolute top-0 overflow-hidden"
                    style={{
                      height: phoneHeight,
                      width: phoneInnerWidth,
                      left: (phoneWidth - phoneInnerWidth) / 2,
                    }}
                  >
                    {image ? (
                      <img
                        src={src}
                        alt=""
                        draggable={false}
                        className="absolute max-w-none select-none"
                        style={{
                          width: image.width * scale * phoneRatio,
                          height: image.height * scale * phoneRatio,
                          transform: `translate(${x * phoneRatio}px, ${y * phoneRatio}px)`,
                        }}
                      />
                    ) : null}
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"
                    aria-hidden
                  />
                </div>
                <div className="mx-auto my-2 h-1 w-10 rounded-full bg-white/25" />
              </div>
              <p className="mt-2 max-w-[180px] text-center text-xs leading-relaxed text-charcoal/70">
                휴대폰 풀화면입니다. 좌우가 잘리면 PC 미리보기에서 위치를
                옮겨 주세요.
              </p>
            </div>
          ) : null}
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
            className="mt-2 h-11 w-full accent-orange"
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

        <div className="sticky bottom-0 mt-6 flex flex-wrap gap-3 bg-white pt-3 md:mt-8">
          <button
            type="button"
            onClick={confirm}
            disabled={!image || saving}
            className="min-h-11 bg-orange px-8 py-3 font-mono text-sm tracking-[0.18em] text-charcoal hover:bg-orange-deep disabled:opacity-40"
          >
            이 구도로 적용
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 px-6 py-3 font-mono text-sm tracking-[0.18em] text-charcoal hover:text-orange"
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
        className={`inline-flex min-h-11 items-center justify-center border border-charcoal/20 font-mono tracking-[0.16em] text-charcoal transition-colors duration-300 hover:border-orange hover:text-orange ${
          compact ? "px-3 py-2.5 text-[11px]" : "px-4 py-2.5 text-[11px]"
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
