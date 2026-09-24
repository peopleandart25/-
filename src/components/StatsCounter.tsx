import { useCountUp } from "../hooks/useCountUp";
import type { StatItem } from "../types";

interface StatsCounterProps {
  item: StatItem;
  active: boolean;
}

export function StatsCounter({ item, active }: StatsCounterProps) {
  const value = useCountUp(item.value, active);

  return (
    <div className="border-t border-white/12 pt-5">
      <p className="font-display text-5xl leading-none text-white md:text-6xl">
        {String(value).padStart(item.pad, "0")}
        <span className="text-orange">{item.suffix}</span>
      </p>
      <p className="mt-3 font-mono text-sm tracking-[0.18em] text-white">
        {item.label}
      </p>
      <p className="mt-1 text-base text-white/50">{item.caption}</p>
    </div>
  );
}
