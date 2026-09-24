import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "ko", shortKey: "langShort.ko", menuKey: "lang.ko" },
  { code: "en", shortKey: "langShort.en", menuKey: "lang.en" },
  { code: "zh", shortKey: "langShort.zh", menuKey: "lang.zh" },
] as const;

export function LanguageSwitcher({
  layout = "header",
}: {
  layout?: "header" | "menu";
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const locale = (i18n.resolvedLanguage || i18n.language || "ko").split("-")[0];
  const current =
    LANGUAGES.find((item) => item.code === locale) ?? LANGUAGES[0];

  const selectLanguage = (code: string) => {
    void i18n.changeLanguage(code).then(() => {
      localStorage.setItem("i18nextLng", code);
      document.documentElement.lang = code;
    });
    setOpen(false);
  };

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (layout === "menu") {
    return (
      <div
        className="flex gap-2"
        role="listbox"
        aria-label={t("lang.label")}
      >
        {LANGUAGES.map((item) => {
          const active = current.code === item.code;
          return (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={active}
              className={`min-h-12 flex-1 p-3 font-mono text-sm tracking-[0.16em] transition-colors duration-300 ${
                active
                  ? "bg-orange text-charcoal"
                  : "bg-white/5 text-white/70"
              }`}
              onClick={() => selectLanguage(item.code)}
            >
              {t(item.menuKey)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative isolate bg-transparent"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 bg-transparent px-1 py-2 font-mono text-lg font-medium tracking-[0.12em] text-white transition-colors duration-300 hover:text-orange md:text-xl"
        aria-label={t("lang.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        onClick={() => {
          const hoverable =
            window.matchMedia("(hover: hover) and (pointer: fine)").matches;
          if (hoverable) setOpen(true);
          else setOpen((prev) => !prev);
        }}
      >
        <Globe size={22} strokeWidth={1.5} />
        <span>{t(current.shortKey)}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        id={menuId}
        role="listbox"
        className={`absolute right-0 top-full z-50 min-w-[8.75rem] border border-white/12 bg-black pt-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-all duration-300 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {LANGUAGES.map((item) => {
          const active = current.code === item.code;
          return (
            <li key={item.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={active}
                className={`block w-full px-4 py-2.5 text-left font-mono text-base font-medium tracking-[0.12em] transition-colors duration-300 ${
                  active
                    ? "bg-white/5 text-orange"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => {
                  selectLanguage(item.code);
                }}
              >
                {t(item.menuKey)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
