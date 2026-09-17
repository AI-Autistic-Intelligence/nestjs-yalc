export class I18nEngine {
  private translations: Map<string, Map<string, string>> = new Map();
  private defaultLocale: string;

  constructor(defaultLocale: string = 'en') {
    this.defaultLocale = defaultLocale;
  }

  public registerTranslations(locale: string, dict: Record<string, string>): void {
    if (!this.translations.has(locale)) {
      this.translations.set(locale, new Map());
    }
    const map = this.translations.get(locale)!;
    for (const [k, v] of Object.entries(dict)) {
      map.set(k, v);
    }
  }

  public translate(key: string, params: Record<string, any> = {}, locale?: string): string {
    const targetLocale = locale || this.defaultLocale;
    let template =
      this.translations.get(targetLocale)?.get(key) ||
      this.translations.get(this.defaultLocale)?.get(key) ||
      key;

    for (const [paramKey, paramVal] of Object.entries(params)) {
      template = template.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramVal));
    }

    return template;
  }
}
