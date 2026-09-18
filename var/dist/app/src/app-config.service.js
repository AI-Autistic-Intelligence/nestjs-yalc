"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
exports.createAppConfigProvider = createAppConfigProvider;
exports.getAppConfigToken = getAppConfigToken;
exports.getAppEventToken = getAppEventToken;
exports.getAppLoggerToken = getAppLoggerToken;
const config_1 = require("@nestjs/config");
class AppConfigService {
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
exports.AppConfigService = AppConfigService;
function createAppConfigProvider(appAlias) {
    return {
        provide: getAppConfigToken(appAlias),
        useFactory: (config) => {
            return new AppConfigService(config, appAlias);
        },
        inject: [config_1.ConfigService],
    };
}
function getAppConfigToken(appAlias) {
    return `${appAlias}Config`;
}
function getAppEventToken(appAlias) {
    return `${appAlias}Event`;
}
function getAppLoggerToken(appAlias) {
    return `${appAlias}Logger`;
}
//# sourceMappingURL=app-config.service.js.map