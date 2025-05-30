// i18n.js у нее не получилось интегрировать смену языков.........................
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n.translations = { en, ru };
i18n.fallbacks = true;
i18n.defaultLocale = 'ru';

export const setI18nConfig = (lang) => {
  i18n.locale = lang;
};

export default i18n;
