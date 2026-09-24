import { useState, type ChangeEvent } from "react";
import { readImageFile } from "../lib/imageFile";
import {
  ImageAdjustModal,
  type ImageCropSpec,
} from "./ImageAdjustModal";

interface FileImageButtonProps {
  label: string;
  onLoaded: (dataUrl: string) => void;
  maxEdge?: number;
  quality?: number;
  compact?: boolean;
  crop?: ImageCropSpec;
}

export function FileImageButton({
  label,
  onLoaded,
  maxEdge = 1600,
  quality = 0.8,
  compact = false,
  crop,
}: FileImageButtonProps) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readImageFile(
        file,
        crop ? Math.max(maxEdge, 2400) : maxEdge,
        crop ? 0.92 : quality,
      );
      if (crop) {
        setPending(dataUrl);
        return;
      }
      onLoaded(dataUrl);
    } catch {
      setError("이미지를 읽을 수 없습니다.");
    }
  };

  return (
    <div>
      <label
        className={`inline-flex cursor-pointer items-center justify-center border border-charcoal/20 font-mono tracking-[0.16em] text-charcoal transition-colors duration-300 hover:border-orange hover:text-orange ${
          compact
            ? "px-3 py-2 text-[10px]"
            : "px-4 py-2.5 text-[11px]"
        }`}
      >
        {label}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onChange}
        />
      </label>
      {error ? (
        <p className="mt-2 text-sm text-orange" role="alert">
          {error}
        </p>
      ) : null}
      {pending && crop ? (
        <ImageAdjustModal
          src={pending}
          spec={crop}
          onCancel={() => setPending(null)}
          onConfirm={(dataUrl) => {
            setPending(null);
            onLoaded(dataUrl);
          }}
        />
      ) : null}
    </div>
  );
}
