"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppBootstrap = exports.getMainBootstrappedApp = exports.getBootstrappedApps = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const def_const_js_1 = require("./def.const.js");
const base_app_module_helper_js_1 = require("./base-app-module.helper.js");
const logger_helper_js_1 = require("@nestjs-yalc/logger/logger.helper.js");
const promise_helper_js_1 = require("@nestjs-yalc/utils/promise.helper.js");
common_1.Logger.overrideLogger((0, logger_helper_js_1.getEnvLoggerLevels)());
const bootstrappedApps = new Set();
const getBootstrappedApps = () => {
    return bootstrappedApps;
};
exports.getBootstrappedApps = getBootstrappedApps;
const getMainBootstrappedApp = () => {
    if ((0, exports.getBootstrappedApps)().size === 0) {
        return null;
    }
    return (0, exports.getBootstrappedApps)().values().next().value;
};
exports.getMainBootstrappedApp = getMainBootstrappedApp;
class BaseAppBootstrap {
    constructor(appAlias, appModule, options) {
        var _a, _b, _c;
        this.appAlias = appAlias;
        this.appModule = appModule;
        this.isClosed = false;
        this.module = base_app_module_helper_js_1.YalcDefaultAppModule.forRoot(this.appAlias, [appModule, ...((_b = (_a = options === null || options === void 0 ? void 0 : options.globalsOptions) === null || _a === void 0 ? void 0 : _a.extraImports) !== null && _b !== void 0 ? _b : [])], options === null || options === void 0 ? void 0 : options.globalsOptions);
        const bootstrappedApp = (0, exports.getMainBootstrappedApp)();
        if (bootstrappedApp &&
            !((_c = options === null || options === void 0 ? void 0 : options.globalsOptions) === null || _c === void 0 ? void 0 : _c.skipMultiServerCheck) &&
            process.env.APP_SKIP_MULTISERVER_CHECK !== 'true') {
            throw new Error(`You are trying to bootstrap multiple servers (${bootstrappedApp.appAlias}) in the same process. This is not allowed. Use a different process for each server`);
        }
        (0, exports.getBootstrappedApps)().add(this);
    }
    async initApp(options) {
        options;
        return this;
    }
    setApp(app) {
        this.app = app;
        const originalCloseFn = this.app.close.bind(this.app);
        this.app.close = async () => {
            const closeRes = await originalCloseFn();
            this.closeCleanup();
            return closeRes;
        };
        const originalInitFn = this.app.init.bind(this.app);
        this.app.init = async () => {
            this.isClosed = false;
            (0, exports.getBootstrappedApps)().add(this);
            let initRes;
            try {
                initRes = await originalInitFn();
            }
            catch (error) {
                this.closeCleanup();
                throw error;
            }
            return initRes;
        };
        return this;
    }
    closeCleanup() {
        this.isClosed = true;
        (0, exports.getBootstrappedApps)().delete(this);
    }
    isAppClosed() {
        return this.isClosed;
    }
    getAppAlias() {
        return this.appAlias;
    }
    getConf() {
        const configService = this.getApp().get(config_1.ConfigService);
        return configService.get(this.appAlias);
    }
    getApp() {
        if (!this.app) {
            throw new Error('This app is not initialized yet');
        }
        return this.app;
    }
    async closeApp() {
        var _a;
        await this.cleanup();
        await ((_a = this.app) === null || _a === void 0 ? void 0 : _a.close());
        this.closeCleanup();
    }
    async cleanup() {
        await promise_helper_js_1.globalPromiseTracker.waitForAll();
    }
    getAppModule() {
        return this.appModule;
    }
    getModule() {
        return this.module;
    }
    async applyBootstrapGlobals(_options) {
        var _a, _b;
        this.loggerService = this.getApp().get(def_const_js_1.SYSTEM_LOGGER_SERVICE);
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Setting logger service...');
        this.getApp().useLogger(this.loggerService);
        common_1.Logger.overrideLogger(this.loggerService);
        return this;
    }
}
exports.BaseAppBootstrap = BaseAppBootstrap;
//# sourceMappingURL=app-bootstrap-base.helper.js.map