import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTopButton() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname === "/admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const visible = !isHome && !isAdmin && scrolled;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="페이지 상단으로 이동"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
          }}
          className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center p-3 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 hover:text-orange md:bottom-8 md:right-16"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <ArrowUp size={18} strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
