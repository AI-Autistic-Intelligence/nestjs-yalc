import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * This service is used to access the app config registered with a specific app alias.
 * This is useful when you want to access the config of the current app with the dependency injection and
 * without specifying the app alias.
 */
export declare class AppConfigService<T = any> {
    readonly service: ConfigService;
    protected readonly appAlias: string;
    protected _config: T;
    constructor(service: ConfigService, appAlias: string);
    /**
     * Type-safe access to the app config values of the current app.
     */
    get values(): T;
    /**
     * @deprecated - use .values instead
     */
    get(): T;
}
export declare function createAppConfigProvider(appAlias: string): Provider;
export declare function getAppConfigToken(appAlias: string): string;
export declare function getAppEventToken(appAlias: string): string;
export declare function getAppLoggerToken(appAlias: string): string;
