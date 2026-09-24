interface SectionLabelProps {
  index: string;
  label: string;
}

export function SectionLabel({ index, label }: SectionLabelProps) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.28em] text-white/45 md:text-base">
      <span className="text-orange">{index}</span>
      <span className="h-px w-10 bg-orange/70" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
