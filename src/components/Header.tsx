import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { useAgency } from "../context/AgencyContext";
import { GNB_ITEMS } from "../data/nav";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { categories } = useAgency();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const artistsMenuId = useId();
  const artistsRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      GNB_ITEMS.map((item) =>
        item.id === "artists"
          ? {
              ...item,
              label: t(`nav.${item.id}`),
              children: categories.map((folder) => ({
                id: folder.id,
                label: t(`category.${folder.id}`, {
                  defaultValue: folder.nameKo,
                }),
                to: `/artists/${folder.id}`,
              })),
            }
          : { ...item, label: t(`nav.${item.id}`) },
      ),
    [categories, t],
  );

  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setArtistsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!artistsRef.current?.contains(event.target as Node)) {
        setArtistsOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setArtistsOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "bg-ink" : "bg-transparent"
      }`}
    >
      <div className="relative flex h-[4.75rem] w-full items-center justify-between bg-transparent px-6 md:h-[10rem] md:px-10 lg:px-16">
        <Link
          to="/"
          className="relative z-10 flex shrink-0 items-center border-0 bg-transparent p-3 -ml-3 shadow-none outline-none ring-0 focus:outline-none focus-visible:outline-none md:ml-0 md:p-0"
        >
          <BrandLogo
            className="block h-auto w-[5.75rem] border-0 bg-transparent outline-none md:w-40"
            src="/pia-em-logo.png?v=1"
          />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 whitespace-nowrap bg-transparent lg:flex xl:gap-14"
          aria-label={t("nav.main")}
        >
          {items.map((item) => {
            const artistsActive = location.pathname.startsWith("/artist");

            if (item.id === "artists") {
              return (
                <div
                  key={item.id}
                  ref={artistsRef}
                  className="relative"
                  onMouseEnter={() => setArtistsOpen(true)}
                  onMouseLeave={() => setArtistsOpen(false)}
                >
                  <NavLink
                    to={item.to}
                    className="group relative inline-flex items-center bg-transparent font-mono text-xl font-medium tracking-[0.12em] text-white xl:text-2xl"
                    onFocus={() => setArtistsOpen(true)}
                    aria-current={artistsActive ? "page" : undefined}
                    aria-expanded={artistsOpen}
                    aria-haspopup="true"
                    aria-controls={artistsMenuId}
                  >
                    {artistsActive && (
                      <span
                        className="absolute -top-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange"
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-orange transition-all duration-300 ${
                        artistsOpen || artistsActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                      aria-hidden="true"
                    />
                  </NavLink>
                  <ul
                    id={artistsMenuId}
                    className={`absolute left-1/2 top-full z-50 mt-3 min-w-[168px] -translate-x-1/2 bg-ink py-2 transition-all duration-300 ${
                      artistsOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                    role="menu"
                  >
                    {item.children?.map((child) => (
                      <li key={child.id} role="none">
                        <Link
                          to={child.to}
                          role="menuitem"
                          className="block w-full px-5 py-2.5 text-left font-mono text-base font-medium tracking-[0.1em] text-white/80 transition-colors duration-300 hover:text-orange"
                          onClick={() => setArtistsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.to}
                className="group relative bg-transparent font-mono text-xl font-medium tracking-[0.12em] text-white xl:text-2xl"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute -top-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange"
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-orange transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-1 bg-transparent md:gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center p-3 text-white lg:hidden"
            aria-label={t("nav.open")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <MobileMenu
        open={menuOpen}
        items={items}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
