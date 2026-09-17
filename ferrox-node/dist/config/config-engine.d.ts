export declare class ConfigEngine {
    private configStore;
    constructor(defaults?: Record<string, any>);
    get<T = any>(key: string, fallback?: T): T;
    set(key: string, value: any): void;
}
