import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Artist } from "../types";
import { SmartImage } from "./SmartImage";

interface ArtistCardProps {
  artist: Artist;
  priority?: boolean;
}

export function ArtistCard({ artist, priority = false }: ArtistCardProps) {
  const { t } = useTranslation();
  return (
    <article className="group relative overflow-hidden">
      <Link
        to={`/artist/${artist.id}`}
        className="block"
        aria-label={t("artists.profile", { name: artist.name })}
      >
        <div className="aspect-[3/4] overflow-hidden">
          <SmartImage
            src={artist.profileImage}
            alt={artist.name}
            className="h-full w-full"
            priority={priority}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
          <h3 className="font-display text-xl leading-none text-white md:text-3xl">
            {artist.name}
          </h3>
          <p className="mt-1 font-mono text-xs tracking-[0.16em] text-white/70 md:text-base md:tracking-[0.18em]">
            {artist.englishName}
          </p>
        </div>
      </Link>
    </article>
  );
}
