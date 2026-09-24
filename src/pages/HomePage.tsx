import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { SmartImage } from "../components/SmartImage";
import { HeroBrand, RichAmp, isBrandTitle } from "../components/Ampersand";
import { useAgency } from "../context/AgencyContext";
import { BRAND_SHORT } from "../data/company";
import { useTranslation } from "react-i18next";
import { usePublicCopy } from "../hooks/usePublicCopy";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function HomePage() {
  const { t } = useTranslation();
  const { banners } = useAgency();
  const { homeSlogan } = usePublicCopy();
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("home-lock");
    return () => {
      document.documentElement.classList.remove("home-lock");
    };
  }, []);

  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: "fallback",
            image: "",
            title: BRAND_SHORT,
            subtitle: homeSlogan,
            order: 0,
          },
        ];
  const canSlide = slides.length > 1;

  return (
    <main
      id="main"
      className="relative h-dvh w-screen overflow-hidden bg-ink"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reduceMotion ? 0 : 900}
        loop={canSlide}
        simulateTouch
        grabCursor={canSlide}
        allowTouchMove={canSlide}
        touchRatio={1}
        navigation={canSlide}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={
          canSlide && !reduceMotion
            ? { delay: 2000, disableOnInteraction: false }
            : false
        }
        pagination={canSlide ? { clickable: true } : false}
        className="banner-swiper h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full overflow-hidden bg-ink">
              {slide.image ? (
                <div className="absolute inset-0">
                  <SmartImage
                    src={slide.image}
                    alt={slide.title || BRAND_SHORT}
                    priority={index === 0}
                    className="h-full w-full bg-transparent"
                  />
                </div>
              ) : null}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"
                aria-hidden="true"
              />
              {(slide.title || homeSlogan) && (
                <div className="pointer-events-none absolute inset-x-6 bottom-28 z-10 md:inset-x-auto md:bottom-16 md:left-16">
                  {homeSlogan ? (
                    <p className="mb-2 flex items-center gap-3 font-mono text-sm font-medium tracking-[0.14em] text-white/70 md:mb-3 md:text-lg md:tracking-[0.16em]">
                      <span
                        className="h-1 w-1 shrink-0 rounded-full bg-orange"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{homeSlogan}</span>
                    </p>
                  ) : null}
                  {slide.title ? (
                    <p className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-6xl">
                      {isBrandTitle(slide.title) ? (
                        <HeroBrand />
                      ) : (
                        <RichAmp text={slide.title} />
                      )}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {canSlide ? (
        <>
          <button
            type="button"
            className="banner-nav-prev absolute left-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center p-3 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:text-white md:left-4 md:h-24 md:w-24 md:p-0"
            aria-label={t("home.prev")}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft className="h-8 w-8 md:h-[72px] md:w-[72px]" strokeWidth={1.15} />
          </button>
          <button
            type="button"
            className="banner-nav-next absolute right-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center p-3 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:text-white md:right-4 md:h-24 md:w-24 md:p-0"
            aria-label={t("home.next")}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight className="h-8 w-8 md:h-[72px] md:w-[72px]" strokeWidth={1.15} />
          </button>
        </>
      ) : null}
    </main>
  );
}
