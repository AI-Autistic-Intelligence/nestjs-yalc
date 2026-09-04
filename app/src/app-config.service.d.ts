import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AppConfigService<T = any> {
    readonly service: ConfigService;
    protected readonly appAlias: string;
    protected _config: T;
    constructor(service: ConfigService, appAlias: string);
    get values(): T;
    get(): T;
}
export declare function createAppConfigProvider(appAlias: string): Provider;
export declare function getAppConfigToken(appAlias: string): string;
export declare function getAppEventToken(appAlias: string): string;
export declare function getAppLoggerToken(appAlias: string): string;
