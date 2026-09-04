import { NestFactory } from '@nestjs/core';
import { envIsTrue } from '@nestjs-yalc/utils/env.helper.js';
import clc from 'cli-color';
import { BaseAppBootstrap, } from './app-bootstrap-base.helper.js';
import { getEnvLoggerLevels } from '@nestjs-yalc/logger/logger.helper.js';
export class StandaloneAppBootstrap extends BaseAppBootstrap {
    constructor(appAlias, module, options) {
        super(appAlias, module, { globalsOptions: options });
    }
    async initApp(options) {
        await this.createApp({
            createOptions: options?.createOptions,
        });
        await this.applyBootstrapGlobals(options?.createOptions);
        await this.getApp().init();
        if (envIsTrue(process.env.APP_DRY_RUN) === true) {
            this.loggerService?.log('Dry run, exiting...');
            await this.getApp().close();
            process.exit(0);
        }
        return this;
    }
    async createApp(_options) {
        let app;
        try {
            app = await NestFactory.createApplicationContext(this.module, {
                logger: getEnvLoggerLevels(),
            });
        }
        catch (err) {
            this.closeCleanup();
            console.error(clc.red('Failed to create app'), clc.red(err));
            throw new Error('Process aborted');
        }
        return this.setApp(app);
    }
}
//# sourceMappingURL=app-bootstrap-standalone.helper.js.map