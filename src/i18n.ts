import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import zh from "./locales/zh.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "ko",
    supportedLngs: ["ko", "en", "zh"],
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      convertDetectedLanguage: (lng) => lng.split("-")[0],
    },
  });

i18n.on("languageChanged", (lng) => {
  const short = lng.split("-")[0] || "ko";
  document.documentElement.lang = short;
});

document.documentElement.lang =
  (i18n.resolvedLanguage || i18n.language || "ko").split("-")[0];

export default i18n;
