import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface DetailModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function DetailModal({ title, onClose, children }: DetailModalProps) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-[2px] md:items-center md:p-8"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="max-h-[92vh] w-full overflow-y-auto border border-white/10 bg-charcoal px-6 py-8 shadow-2xl md:max-w-2xl md:px-10 md:py-10"
        initial={reduceMotion ? false : { y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { y: 16, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            id={labelId}
            className="font-display text-3xl font-medium leading-tight text-white md:text-4xl"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-white transition-colors duration-300 hover:text-orange"
            aria-label="닫기"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
