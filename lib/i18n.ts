import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly for bundling
import enCreatorEarn from '@/public/locales/en/creatorEarn.json';
import hiLatnCreatorEarn from '@/public/locales/hi-Latn/creatorEarn.json';

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
        ns: ['creatorEarn'],
        defaultNS: 'creatorEarn',
        resources: {
          en: {
            creatorEarn: enCreatorEarn,
          },
          'hi-Latn': {
            creatorEarn: hiLatnCreatorEarn,
          },
        },
        detection: {
          order: ['localStorage', 'navigator'],
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
