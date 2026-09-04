import { ConfigService } from '@nestjs/config';
export class AppConfigService {
    constructor(service, appAlias) {
        this.service = service;
        this.appAlias = appAlias;
        const config = this.service.get(this.appAlias);
        if (!config) {
            throw new Error(`AppConfigService: No config found for app alias '${this.appAlias}'`);
        }
        this._config = config;
    }
    get values() {
        return this._config;
    }
    get() {
        return this.values;
    }
}
export function createAppConfigProvider(appAlias) {
    return {
        provide: getAppConfigToken(appAlias),
        useFactory: (config) => {
            return new AppConfigService(config, appAlias);
        },
        inject: [ConfigService],
    };
}
export function getAppConfigToken(appAlias) {
    return `${appAlias}Config`;
}
export function getAppEventToken(appAlias) {
    return `${appAlias}Event`;
}
export function getAppLoggerToken(appAlias) {
    return `${appAlias}Logger`;
}
//# sourceMappingURL=app-config.service.js.map