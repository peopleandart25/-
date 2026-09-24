import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import type { NavItem } from "../types";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface MobileMenuProps {
  open: boolean;
  items: NavItem[];
  onClose: () => void;
}

export function MobileMenu({ open, items, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const [artistsOpen, setArtistsOpen] = useState(false);

  useEffect(() => {
    if (!open) setArtistsOpen(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-ink/97 px-6 pb-10 pt-20 backdrop-blur-md lg:hidden"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.main")}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center p-3 text-white"
            aria-label={t("nav.close")}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
          <motion.nav
            className="flex flex-1 flex-col justify-center gap-1"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.map((item, index) => {
              const isActive =
                item.id === "artists"
                  ? location.pathname.startsWith("/artist")
                  : location.pathname === item.to;
              const hasChildren = Boolean(item.children?.length);

              return (
                <motion.div
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.06 * index,
                    duration: 0.4,
                  }}
                  className="border-b border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex min-h-14 flex-1 items-center justify-between py-3 pr-2 text-left"
                    >
                      <span
                        className={`font-display text-[2rem] leading-none tracking-[-0.03em] ${isActive ? "text-orange" : "text-white"}`}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-white/35">
                        0{index + 1}
                      </span>
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        className="ml-1 flex h-12 w-12 items-center justify-center p-3 text-white"
                        aria-expanded={artistsOpen}
                        aria-controls="mobile-artists-submenu"
                        aria-label={t("nav.artistsSub")}
                        onClick={() => setArtistsOpen((prev) => !prev)}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${artistsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                  {hasChildren && (
                    <AnimatePresence>
                      {artistsOpen && (
                        <motion.ul
                          id="mobile-artists-submenu"
                          className="mb-3 space-y-0.5 overflow-hidden pl-1"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            reduceMotion
                              ? undefined
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {item.children?.map((child) => (
                            <li key={child.id}>
                              <Link
                                to={child.to}
                                onClick={onClose}
                                className="block min-h-11 px-1 py-3 font-mono text-sm font-medium tracking-[0.12em] text-white/70 transition-colors duration-300 hover:text-orange"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}
          </motion.nav>
          <div className="mt-8">
            <LanguageSwitcher layout="menu" />
          </div>
          <p className="mt-5 font-mono text-xs tracking-[0.2em] text-white/40">
            {t("common.management")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
