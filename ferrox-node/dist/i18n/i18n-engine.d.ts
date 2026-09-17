export declare class I18nEngine {
    private translations;
    private defaultLocale;
    constructor(defaultLocale?: string);
    registerTranslations(locale: string, dict: Record<string, string>): void;
    translate(key: string, params?: Record<string, any>, locale?: string): string;
}
