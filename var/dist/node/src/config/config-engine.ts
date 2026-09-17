export class ConfigEngine {
  private configStore: Map<string, any> = new Map();

  constructor(defaults: Record<string, any> = {}) {
    for (const [k, v] of Object.entries(defaults)) {
      this.configStore.set(k, v);
    }
  }

  public get<T = any>(key: string, fallback?: T): T {
    const envVal = process.env[key];
    if (envVal !== undefined) {
      if (envVal === 'true') return true as unknown as T;
      if (envVal === 'false') return false as unknown as T;
      if (!isNaN(Number(envVal))) return Number(envVal) as unknown as T;
      return envVal as unknown as T;
    }

    if (this.configStore.has(key)) {
      return this.configStore.get(key) as T;
    }

    return fallback as T;
  }

  public set(key: string, value: any): void {
    this.configStore.set(key, value);
  }
}
