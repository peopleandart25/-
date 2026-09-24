import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";
import { BrandName, RichAmp } from "./Ampersand";
import { BrandLogo } from "./BrandLogo";
import { DetailModal } from "./DetailModal";
import { useAgency } from "../context/AgencyContext";
import { privacyPolicy, termsOfUse } from "../data/company";
import { GNB_ITEMS } from "../data/nav";

export function Footer() {
  const { t } = useTranslation();
  const { footer } = useAgency();
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  const copy = legal === "privacy" ? privacyPolicy : termsOfUse;
  const phoneHref = footer.phone.replace(/\s/g, "");

  return (
    <footer className="bg-charcoal text-white">
      <div className="editorial-grid py-12 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="bg-transparent lg:col-span-4">
            <BrandLogo
              className="h-16 w-auto bg-transparent object-contain md:h-[104px]"
              src="/pia-em-logo.png?v=1"
            />
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="font-mono text-base tracking-[0.22em] text-orange">
                {t("footer.visit")}
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/75 md:text-lg">
                {footer.address}
              </p>
            </div>
            <div>
              <p className="font-mono text-base tracking-[0.22em] text-orange">
                {t("footer.contact")}
              </p>
              <a
                href={`mailto:${footer.email}`}
                className="mt-3 block min-h-11 py-2 text-base text-white/75 transition-colors duration-300 hover:text-orange md:min-h-0 md:py-0 md:text-lg"
              >
                {footer.email}
              </a>
              <a
                href={`tel:${phoneHref}`}
                className="mt-1 block min-h-11 py-2 text-base text-white/75 transition-colors duration-300 hover:text-orange md:mt-2 md:min-h-0 md:py-0 md:text-lg"
              >
                {footer.phone}
              </a>
            </div>
            <div>
              <p className="font-mono text-base tracking-[0.22em] text-orange">
                {t("footer.follow")}
              </p>
              <a
                href={footer.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex min-h-11 items-center gap-2 whitespace-nowrap py-2 text-base text-white/75 transition-colors duration-300 hover:text-orange md:min-h-0 md:py-0 md:text-lg"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.5} />
                {footer.instagramHandle}
              </a>
              <a
                href={footer.youtube}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex min-h-11 items-center gap-2 whitespace-nowrap py-2 text-base text-white/75 transition-colors duration-300 hover:text-orange md:mt-2 md:min-h-0 md:py-0 md:text-lg"
                aria-label="YouTube"
              >
                <Youtube size={16} strokeWidth={1.5} />
                <RichAmp text={footer.youtubeHandle} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-orange/40 pt-6 md:mt-14 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t("nav.main")}>
            {GNB_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="inline-flex min-h-11 items-center py-2 font-mono text-sm tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-orange"
              >
                {t(`nav.${item.id}`)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setLegal("privacy")}
              className="inline-flex min-h-11 items-center py-2 font-mono text-sm tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-orange"
            >
              {t("footer.privacy")}
            </button>
            <button
              type="button"
              onClick={() => setLegal("terms")}
              className="inline-flex min-h-11 items-center py-2 font-mono text-sm tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-orange"
            >
              {t("footer.terms")}
            </button>
            <Link
              to="/admin"
              className="inline-flex min-h-11 items-center py-2 font-mono text-sm tracking-[0.18em] text-white/35 transition-colors duration-300 hover:text-orange"
            >
              Admin
            </Link>
            <p className="font-mono text-sm tracking-[0.16em] text-white/35">
              © {new Date().getFullYear()} <BrandName />
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {legal && (
          <DetailModal title={copy.title} onClose={() => setLegal(null)}>
            <p className="mb-5 font-mono text-base tracking-[0.2em] text-orange">
              UPDATED {copy.updated}
            </p>
            <div className="space-y-4 text-lg leading-relaxed text-white/80">
              {copy.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <RichAmp text={paragraph} />
                </p>
              ))}
            </div>
          </DetailModal>
        )}
      </AnimatePresence>
    </footer>
  );
}
