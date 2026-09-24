import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAgency } from "../context/AgencyContext";
import { RichAmp } from "../components/Ampersand";

export function NewsPage() {
  const { t } = useTranslation();
  const { news } = useAgency();

  return (
    <main id="main" className="min-h-dvh bg-ink pt-24 pb-20 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <p className="font-mono text-base tracking-[0.22em] text-orange md:text-lg">
          {t("news.kicker")}
        </p>
        <h1 className="mt-3 font-display text-4xl text-white md:text-7xl">
          {t("news.title")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/50 md:text-lg">{t("news.intro")}</p>

        {news.length === 0 ? (
          <p className="mt-16 text-lg text-white/45">{t("news.empty")}</p>
        ) : (
          <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {news.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/news/${item.id}`}
                  className="group flex w-full flex-col gap-4 py-5 md:flex-row md:items-start md:gap-10 md:py-6"
                >
                  {item.image ? (
                    <div className="h-28 w-full shrink-0 overflow-hidden bg-charcoal md:h-24 md:w-40">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <span className="shrink-0 font-mono text-base tracking-[0.16em] text-white/40">
                    {item.date}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-2xl text-white transition-colors duration-300 group-hover:text-orange md:text-4xl">
                      <RichAmp text={item.title} />
                    </span>
                    <span className="mt-2 block text-base text-white/50 md:text-lg">
                      <RichAmp text={item.excerpt} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
