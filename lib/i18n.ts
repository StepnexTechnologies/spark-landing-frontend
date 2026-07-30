import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly for bundling
import enCreatorEarn from '@/public/locales/en/creatorEarn.json';
import hiLatnCreatorEarn from '@/public/locales/hi-Latn/creatorEarn.json';
// creatorPromo is Hinglish-only — no English bundle. The promo route forces
// hi-Latn at mount, so en pulls the same file as a defensive fallback.
import hiLatnCreatorPromo from '@/public/locales/hi-Latn/creatorPromo.json';
// creatorPortfolio powers /creator/portfolio. Ships both en + hi-Latn like
// creatorEarn so the language switcher works on that route.
import enCreatorPortfolio from '@/public/locales/en/creatorPortfolio.json';
import hiLatnCreatorPortfolio from '@/public/locales/hi-Latn/creatorPortfolio.json';

const isBrowser = typeof window !== 'undefined';

// Initialize on both server and client so SSR renders real strings instead
// of bare i18n keys (or empty mounted-gates). LanguageDetector relies on
// browser APIs so it only registers in the browser; on the server we fall
// back to `fallbackLng` ('en'), which is fine because:
//   - creatorPromo is always Hinglish (both en + hi-Latn map to the same bundle)
//   - creatorEarn defaults to English copy on SSR; client-side detection then
//     flips to Hindi if needed (i18next swaps text in place — no remount).
const initI18n = () => {
  if (!i18n.isInitialized) {
    const chain = isBrowser ? i18n.use(LanguageDetector) : i18n;
    chain
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        lng: isBrowser ? undefined : 'en',
        supportedLngs: ['en', 'hi-Latn'],
        debug: false,
        ns: ['creatorEarn', 'creatorPromo', 'creatorPortfolio'],
        defaultNS: 'creatorEarn',
        resources: {
          en: {
            creatorEarn: enCreatorEarn,
            creatorPromo: hiLatnCreatorPromo,
            creatorPortfolio: enCreatorPortfolio,
          },
          'hi-Latn': {
            creatorEarn: hiLatnCreatorEarn,
            creatorPromo: hiLatnCreatorPromo,
            creatorPortfolio: hiLatnCreatorPortfolio,
          },
        },
        detection: {
          order: ['querystring', 'localStorage', 'navigator'],
          lookupQuerystring: 'lang',
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        initImmediate: false,
      });
  }

  // Re-apply resource bundles every time this module evaluates. Without this,
  // edits to locale JSONs only take effect after a full dev-server restart,
  // because i18next.init() locks in `resources` on first call. Passing
  // deep=true + overwrite=true makes HMR-friendly key additions Just Work.
  i18n.addResourceBundle('en', 'creatorEarn', enCreatorEarn, true, true);
  i18n.addResourceBundle('en', 'creatorPromo', hiLatnCreatorPromo, true, true);
  i18n.addResourceBundle('en', 'creatorPortfolio', enCreatorPortfolio, true, true);
  i18n.addResourceBundle('hi-Latn', 'creatorEarn', hiLatnCreatorEarn, true, true);
  i18n.addResourceBundle('hi-Latn', 'creatorPromo', hiLatnCreatorPromo, true, true);
  i18n.addResourceBundle('hi-Latn', 'creatorPortfolio', hiLatnCreatorPortfolio, true, true);
};

initI18n();

export type SupportedLang = "en" | "hi-Latn";

export function getCurrentLang(
  i18nLike: { language?: string } = i18n,
): SupportedLang {
  return i18nLike.language?.startsWith("hi") ? "hi-Latn" : "en";
}

export default i18n;
