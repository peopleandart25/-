import { useEffect, useRef, useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}

export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = "center",
  fit = "cover",
  priority = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus("loading");
    const image = imgRef.current;
    if (!image) return;
    if (image.complete && image.naturalWidth > 0) {
      setStatus("loaded");
    } else if (image.complete) {
      setStatus("error");
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      {status !== "loaded" && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal via-[#2c2c2c] to-ink"
          aria-hidden="true"
        />
      )}
      {status === "error" ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-charcoal text-white/50"
          role="img"
          aria-label={alt}
        >
          <span className="font-mono text-[10px] tracking-[0.24em]">IMAGE</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} transition-[opacity,transform] duration-[800ms] ease-out ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
