import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArtistCard } from "../components/ArtistCard";
import { useAgency } from "../context/AgencyContext";

export function ArtistsPage() {
  const { t } = useTranslation();
  const { category } = useParams();
  const { categories, artists, getArtist, getCategory, artistsInCategory } =
    useAgency();

  if (category) {
    const folder = getCategory(category);
    if (!folder) {
      const artistHit = getArtist(category);
      if (artistHit) {
        return <Navigate to={`/artist/${artistHit.id}`} replace />;
      }
    }
  }

  const folder = category ? getCategory(category) : undefined;
  const list = category
    ? artistsInCategory(category)
    : [...artists].sort(
        (a, b) => a.order - b.order || a.name.localeCompare(b.name, "ko"),
      );

  if (category && !folder) {
    return (
      <main id="main" className="editorial-grid min-h-[70vh] bg-ink pt-28 pb-16 md:pt-40 md:pb-20">
        <p className="font-mono text-base tracking-[0.2em] text-orange">
          {t("common.notFound")}
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">
          {t("artists.notFound")}
        </h1>
        <Link
          to="/artists"
          className="mt-8 inline-block font-mono text-base tracking-[0.18em] text-white hover:text-orange"
        >
          {t("artists.back")}
        </Link>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-dvh bg-ink pt-24 pb-20 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <p className="font-mono text-base tracking-[0.22em] text-orange md:text-lg">
          {t("artists.kicker")}
        </p>
        <h1 className="mt-3 font-display text-4xl text-white md:text-7xl">
          {folder ? folder.nameEn : t("artists.all")}
        </h1>
        {folder ? (
          <p className="mt-2 font-mono text-base tracking-[0.18em] text-white/50">
            {t(`category.${folder.id}`, { defaultValue: folder.nameKo })}
          </p>
        ) : null}

        <nav
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 pb-4"
          aria-label={t("artists.kicker")}
        >
          <Link
            to="/artists"
            className={`px-1 py-2 font-mono text-base tracking-[0.18em] transition-colors duration-300 md:text-xl md:tracking-[0.2em] ${
              !category ? "text-orange" : "text-white/50 hover:text-white"
            }`}
          >
            {t("artists.all")}
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              to={`/artists/${item.id}`}
              className={`px-1 py-2 font-mono text-base tracking-[0.18em] transition-colors duration-300 md:text-xl md:tracking-[0.2em] ${
                category === item.id
                  ? "text-orange"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t(`category.${item.id}`, { defaultValue: item.nameKo })}
            </Link>
          ))}
        </nav>

        {list.length === 0 ? (
          <p className="mt-16 text-lg text-white/45">{t("artists.empty")}</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((artist, index) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
