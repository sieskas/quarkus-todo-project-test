import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import translationEN from './translations/en.json';
import translationFR from './translations/fr.json';
import translationES from './translations/es.json';

const resources = {
    en: { translation: translationEN },
    fr: { translation: translationFR },
    es: { translation: translationES },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
const supportedLanguages = ['en', 'fr', 'es'];
const initialLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
