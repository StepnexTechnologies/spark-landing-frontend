import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly for bundling
import enCreatorEarn from '@/public/locales/en/creatorEarn.json';
import hiLatnCreatorEarn from '@/public/locales/hi-Latn/creatorEarn.json';
import enCreatorPromo from '@/public/locales/en/creatorPromo.json';
import hiLatnCreatorPromo from '@/public/locales/hi-Latn/creatorPromo.json';

// Only initialize on client side
const initI18n = () => {
  if (typeof window !== 'undefined' && !i18n.isInitialized) {
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
            creatorPromo: enCreatorPromo,
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
};

initI18n();

export default i18n;
