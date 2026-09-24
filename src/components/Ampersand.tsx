import { Fragment, type CSSProperties } from "react";

const AMP_STYLE: CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: 400,
  fontStyle: "normal",
  letterSpacing: "0.02em",
};

/** 메인 디스플레이 폰트 대신 시스템 Arial로 &만 렌더링합니다. */
export function Ampersand() {
  return (
    <span className="ampersand font-sans font-normal" style={AMP_STYLE}>
      &
    </span>
  );
}

export function HeroBrand({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      P.A E<Ampersand />M
    </span>
  );
}

export function BrandName({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      P.A(PEOPLE <Ampersand /> ART) E<Ampersand />M
    </span>
  );
}

export function RichAmp({ text }: { text: string }) {
  const parts = text.split("&");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 ? <Ampersand /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export function isBrandTitle(title: string) {
  const compact = title.replace(/\s/g, "").toUpperCase();
  return (
    compact.includes("PEOPLE") ||
    compact === "P.AE&M" ||
    compact.startsWith("P.A(")
  );
}
