import { useTranslation } from "react-i18next";
import { useAgency } from "../context/AgencyContext";

export function useLocaleCode() {
  const { i18n } = useTranslation();
  const raw = i18n.resolvedLanguage || i18n.language || "ko";
  return raw.split("-")[0] || "ko";
}

/** 한국어는 Admin 저장 문구, 영어·중국어는 locale 번역을 사용합니다. */
export function usePublicCopy() {
  const { t, i18n } = useTranslation();
  const { copy } = useAgency();
  const locale = (i18n.resolvedLanguage || i18n.language || "ko").split("-")[0];
  const useAdmin = locale === "ko";
  const pick = (adminValue: string | undefined, key: string) => {
    const admin = adminValue?.trim() ?? "";
    if (useAdmin && admin) return admin;
    return t(key);
  };

  return {
    homeSlogan: pick(copy.homeSlogan, "home.slogan"),
    kicker: pick(copy.kicker, "about.kicker"),
    headline: pick(copy.headline, "about.headline"),
    slogan: pick(copy.slogan, "about.slogan"),
    visionLabel: pick(copy.visionLabel, "about.visionLabel"),
    vision: pick(copy.vision, "about.vision"),
    intro: pick(copy.aboutIntro, "about.intro"),
    support: pick(copy.aboutSupport, "about.support"),
  };
}
