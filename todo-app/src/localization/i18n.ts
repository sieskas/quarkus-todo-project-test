// localization/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './translations/en.json';
import translationFR from './translations/fr.json';
import translationES from './translations/es.json';

// The translations
const resources = {
    en: {
        translation: translationEN
    },
    fr: {
        translation: translationFR
    },
    es: {
        translation: translationES
    }
};

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next
    .use(initReactI18next)
    // init i18next
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;