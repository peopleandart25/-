import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { SmartImage } from "../components/SmartImage";
import { RichAmp } from "../components/Ampersand";
import { useAgency } from "../context/AgencyContext";

export function NewsDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getNews } = useAgency();
  const item = id ? getNews(id) : undefined;

  if (!item) {
    return (
      <main id="main" className="editorial-grid min-h-[70vh] bg-ink pt-28 pb-16 md:pt-40 md:pb-20">
        <p className="font-mono text-base tracking-[0.2em] text-orange">
          {t("common.notFound")}
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">
          {t("news.notFound")}
        </h1>
        <Link
          to="/news"
          className="mt-8 inline-flex min-h-11 items-center gap-2 py-2 font-mono text-sm tracking-[0.18em] text-white hover:text-orange md:text-base"
        >
          <ArrowLeft size={16} />
          {t("news.back")}
        </Link>
      </main>
    );
  }

  return (
    <main id="main" className="bg-ink pt-24 pb-20 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <Link
          to="/news"
          className="inline-flex min-h-11 items-center gap-2 py-2 font-mono text-sm tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-orange md:text-base"
        >
          <ArrowLeft size={16} />
          {t("news.kicker")}
        </Link>

        <p className="mt-10 font-mono text-base tracking-[0.16em] text-white/40 md:text-lg">
          {item.date}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-[1.15] text-white md:text-6xl md:leading-[1.1]">
          <RichAmp text={item.title} />
        </h1>
        {item.excerpt ? (
          <p className="mt-6 max-w-2xl text-base text-white/55 md:text-xl">
            <RichAmp text={item.excerpt} />
          </p>
        ) : null}

        {item.image ? (
          <div className="mt-12 aspect-[16/9] overflow-hidden bg-charcoal md:aspect-[16/8]">
            <SmartImage
              src={item.image}
              alt={item.title}
              priority
              className="h-full w-full"
            />
          </div>
        ) : null}

        <div className="mt-12 max-w-3xl whitespace-pre-line text-base leading-relaxed text-white/80 md:text-xl">
          <RichAmp text={item.body} />
        </div>
      </div>
    </main>
  );
}
