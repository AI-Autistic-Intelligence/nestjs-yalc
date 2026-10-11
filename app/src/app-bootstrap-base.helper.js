import { Logger, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_LOGGER_SERVICE } from './def.const.js';
import { YalcDefaultAppModule } from './base-app-module.helper.js';
import { getEnvLoggerLevels } from '@node-yalc/logger/logger.helper.js';
import { globalPromiseTracker } from '@node-yalc/utils/promise.helper.js';
/**
 * Side effect to be executed as soon as the module is imported
 */
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
        options; // extend this method in the child class
        return this;
    }
    setApp(app) {
        this.app = app;
        /**
         * Monkey patch the close method to set the isClosed flag
         */
        const originalCloseFn = this.app.close.bind(this.app);
        this.app.close = async () => {
            const closeRes = await originalCloseFn();
            this.closeCleanup();
            return closeRes;
        };
        /**
         * Monkey patch the init method to set the isClosed flag
         */
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
    /**
     * This method is used to cleanup the app and remove it from the global set of bootstrapped apps
     */
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
        /**
         * When running behind a lambda, we have to await for all the promises that have been added to the global promise tracker
         * to avoid them being killed by the lambda
         * @see - https://stackoverflow.com/questions/64688812/running-tasks-in-aws-lambda-background
         */
        await globalPromiseTracker.waitForAll();
    }
    /**
     *
     * @returns The main module of the business logic (the one that is passed in the constructor)
     */
    getAppModule() {
        return this.appModule;
    }
    /**
     *
     * @returns The global module that is used to bootstrap the app (YalcDefaultAppModule)
     */
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