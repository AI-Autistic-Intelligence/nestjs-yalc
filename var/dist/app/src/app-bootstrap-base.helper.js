import { Logger, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_LOGGER_SERVICE } from './def.const.js';
import { YalcDefaultAppModule } from './base-app-module.helper.js';
import { getEnvLoggerLevels } from '@nestjs-yalc/logger/logger.helper.js';
import { globalPromiseTracker } from '@nestjs-yalc/utils/promise.helper.js';
Logger.overrideLogger(getEnvLoggerLevels());
const bootstrappedApps = new Set();
export const getBootstrappedApps = () => {
    return bootstrappedApps;
};
export const getMainBootstrappedApp = () => {
    if (getBootstrappedApps().size === 0) {
        return null;
    }
    return getBootstrappedApps().values().next().value;
};
export class BaseAppBootstrap {
    constructor(appAlias, appModule, options) {
        this.appAlias = appAlias;
        this.appModule = appModule;
        this.isClosed = false;
        this.module = YalcDefaultAppModule.forRoot(this.appAlias, [appModule, ...(options?.globalsOptions?.extraImports ?? [])], options?.globalsOptions);
        const bootstrappedApp = getMainBootstrappedApp();
        if (bootstrappedApp &&
            !options?.globalsOptions?.skipMultiServerCheck &&
            process.env.APP_SKIP_MULTISERVER_CHECK !== 'true') {
            throw new Error(`You are trying to bootstrap multiple servers (${bootstrappedApp.appAlias}) in the same process. This is not allowed. Use a different process for each server`);
        }
        getBootstrappedApps().add(this);
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
            getBootstrappedApps().add(this);
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
        getBootstrappedApps().delete(this);
    }
    isAppClosed() {
        return this.isClosed;
    }
    getAppAlias() {
        return this.appAlias;
    }
    getConf() {
        const configService = this.getApp().get(ConfigService);
        return configService.get(this.appAlias);
    }
    getApp() {
        if (!this.app) {
            throw new Error('This app is not initialized yet');
        }
        return this.app;
    }
    async closeApp() {
        await this.cleanup();
        await this.app?.close();
        this.closeCleanup();
    }
    async cleanup() {
        await globalPromiseTracker.waitForAll();
    }
    getAppModule() {
        return this.appModule;
    }
    getModule() {
        return this.module;
    }
    async applyBootstrapGlobals(_options) {
        this.loggerService = this.getApp().get(SYSTEM_LOGGER_SERVICE);
        this.loggerService.debug?.('Setting logger service...');
        this.getApp().useLogger(this.loggerService);
        Logger.overrideLogger(this.loggerService);
        return this;
    }
}
//# sourceMappingURL=app-bootstrap-base.helper.js.map