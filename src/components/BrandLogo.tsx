interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  src?: string;
}

const LOGO_SRC = `/${encodeURI("피플앤아트 로고-002 (2)-Photoroom.png")}?v=photoroom`;

export function BrandLogo({
  className = "h-28",
  compact = false,
  src = LOGO_SRC,
}: BrandLogoProps) {
  return (
    <span className="inline-flex border-0 bg-transparent p-0 shadow-none outline-none">
      <img
        src={src}
        alt="P.A E&M"
        className={`bg-transparent object-contain ${className} ${compact ? "max-h-10" : ""}`}
        width={320}
        height={176}
      />
    </span>
  );
}
