import locales from "~/configs/locales";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: locales.locale,
    messages: locales.messages
}))
