import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SmartImage } from "../components/SmartImage";
import { useAgency } from "../context/AgencyContext";
import "swiper/css";
import "swiper/css/pagination";

export function ArtistDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getArtist, getCategory } = useAgency();
  const artist = id ? getArtist(id) : undefined;
  const folder = artist ? getCategory(artist.categoryId) : undefined;

  if (!artist) {
    return (
      <main id="main" className="editorial-grid min-h-[70vh] bg-ink pt-28 pb-16 md:pt-40 md:pb-20">
        <p className="font-mono text-base tracking-[0.2em] text-orange">
          {t("common.notFound")}
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">
          {t("artist.notFound")}
        </h1>
        <Link
          to="/artists"
          className="mt-8 inline-flex items-center gap-2 font-mono text-base tracking-[0.18em] text-white hover:text-orange"
        >
          <ArrowLeft size={16} />
          {t("artist.back")}
        </Link>
      </main>
    );
  }

  const backTo = folder ? `/artists/${folder.id}` : "/artists";
  const gallery = artist.gallery.filter(Boolean);

  return (
    <main id="main" className="bg-ink pt-24 pb-20 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <Link
          to={backTo}
          className="inline-flex min-h-11 items-center gap-2 py-2 font-mono text-sm tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-orange md:text-base"
        >
          <ArrowLeft size={16} />
          {folder
            ? t(`category.${folder.id}`, { defaultValue: folder.nameKo })
            : t("artists.kicker")}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden">
              <SmartImage
                src={artist.profileImage}
                alt={`${artist.name}`}
                priority
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-6">
            {folder ? (
              <p className="font-mono text-base tracking-[0.24em] text-orange md:text-lg">
                {folder.nameEn}
              </p>
            ) : null}
            <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-8xl">
              {artist.name}
            </h1>
            <p className="mt-3 font-mono text-sm tracking-[0.18em] text-white/55 md:text-lg md:tracking-[0.2em]">
              {artist.englishName}
            </p>
            <p className="mt-10 font-mono text-base tracking-[0.22em] text-white/40">
              {t("artist.career")}
            </p>
            <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-white/80 md:text-lg">
              {artist.career}
            </p>
          </div>
        </div>

        {gallery.length > 0 ? (
          <section className="mt-20">
            <p className="font-mono text-base tracking-[0.22em] text-orange">
              {t("artist.gallery")}
            </p>
            <div className="mt-6">
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={16}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4200, disableOnInteraction: false }}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
                className="artist-gallery-swiper"
              >
                {gallery.map((image, index) => (
                  <SwiperSlide key={`${image}-${index}`}>
                    <div className="aspect-[4/5] overflow-hidden">
                      <SmartImage
                        src={image}
                        alt={`${artist.name} ${index + 1}`}
                        className="h-full w-full"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
