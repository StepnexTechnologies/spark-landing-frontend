import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly for bundling
import enCreatorEarn from '@/public/locales/en/creatorEarn.json';
import hiLatnCreatorEarn from '@/public/locales/hi-Latn/creatorEarn.json';
// creatorPromo is Hinglish-only — no English bundle. The promo route forces
// hi-Latn at mount, so en pulls the same file as a defensive fallback.
import hiLatnCreatorPromo from '@/public/locales/hi-Latn/creatorPromo.json';

// Only initialize on client side
const initI18n = () => {
  if (typeof window === 'undefined') return;

  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'hi-Latn'],
        debug: false,
        ns: ['creatorEarn', 'creatorPromo'],
        defaultNS: 'creatorEarn',
        resources: {
          en: {
            creatorEarn: enCreatorEarn,
            creatorPromo: hiLatnCreatorPromo,
          },
          'hi-Latn': {
            creatorEarn: hiLatnCreatorEarn,
            creatorPromo: hiLatnCreatorPromo,
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
      });
  }

  // Re-apply resource bundles every time this module evaluates. Without this,
  // edits to locale JSONs only take effect after a full dev-server restart,
  // because i18next.init() locks in `resources` on first call. Passing
  // deep=true + overwrite=true makes HMR-friendly key additions Just Work.
  i18n.addResourceBundle('en', 'creatorEarn', enCreatorEarn, true, true);
  i18n.addResourceBundle('en', 'creatorPromo', hiLatnCreatorPromo, true, true);
  i18n.addResourceBundle('hi-Latn', 'creatorEarn', hiLatnCreatorEarn, true, true);
  i18n.addResourceBundle('hi-Latn', 'creatorPromo', hiLatnCreatorPromo, true, true);
};

initI18n();

export default i18n;
