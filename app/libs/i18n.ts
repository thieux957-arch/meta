import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import be from '../../public/locales/be/translation.json';
import bz from '../../public/locales/bz/translation.json';
import ca from '../../public/locales/ca/translation.json';
import cz from '../../public/locales/cz/translation.json';
import de from '../../public/locales/de/translation.json';
import en from '../../public/locales/en/translation.json';
import fr from '../../public/locales/fr/translation.json';
import ind from '../../public/locales/in/translation.json';
import it from '../../public/locales/it/translation.json';
import pk from '../../public/locales/pk/translation.json';
import us from '../../public/locales/us/translation.json';
import vn from '../../public/locales/vn/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            be: { translation: be },
            bz: { translation: bz },
            ca: { translation: ca },
            cz: { translation: cz },
            de: { translation: de },
            en: { translation: en },
            fr: { translation: fr },
            in: { translation: ind },
            it: { translation: it },
            pk: { translation: pk },
            us: { translation: us },
            vn: { translation: vn },
        },
        fallbackLng: 'en',
        supportedLngs: ['be', 'bz', 'ca', 'cz', 'de', 'en', 'fr', 'in', 'it', 'pk', 'us', 'vn'],
        // supportedLngs: ['en'],
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
