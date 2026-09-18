"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nEngine = void 0;
class I18nEngine {
    constructor(defaultLocale = 'en') {
        this.translations = new Map();
        this.defaultLocale = defaultLocale;
    }
    registerTranslations(locale, dict) {
        if (!this.translations.has(locale)) {
            this.translations.set(locale, new Map());
        }
        const map = this.translations.get(locale);
        for (const [k, v] of Object.entries(dict)) {
            map.set(k, v);
        }
    }
    translate(key, params = {}, locale) {
        const targetLocale = locale || this.defaultLocale;
        let template = this.translations.get(targetLocale)?.get(key) ||
            this.translations.get(this.defaultLocale)?.get(key) ||
            key;
        for (const [paramKey, paramVal] of Object.entries(params)) {
            template = template.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramVal));
        }
        return template;
    }
}
exports.I18nEngine = I18nEngine;
//# sourceMappingURL=i18n-engine.js.map