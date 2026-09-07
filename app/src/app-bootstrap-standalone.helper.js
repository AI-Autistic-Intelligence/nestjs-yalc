"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneAppBootstrap = void 0;
const core_1 = require("@nestjs/core");
const env_helper_js_1 = require("@nest-yalc-2/utils/env.helper.js");
const cli_color_1 = __importDefault(require("cli-color"));
const app_bootstrap_base_helper_js_1 = require("./app-bootstrap-base.helper.js");
const logger_helper_js_1 = require("@nest-yalc-2/logger/logger.helper.js");
class StandaloneAppBootstrap extends app_bootstrap_base_helper_js_1.BaseAppBootstrap {
    constructor(appAlias, module, options) {
        super(appAlias, module, { globalsOptions: options });
    }
    async initApp(options) {
        await this.createApp({
            createOptions: options?.createOptions,
        });
        await this.applyBootstrapGlobals(options?.createOptions);
        await this.getApp().init();
        if ((0, env_helper_js_1.envIsTrue)(process.env.APP_DRY_RUN) === true) {
            this.loggerService?.log('Dry run, exiting...');
            await this.getApp().close();
            process.exit(0);
        }
        return this;
    }
    async createApp(_options) {
        let app;
        try {
            app = await core_1.NestFactory.createApplicationContext(this.module, {
                logger: (0, logger_helper_js_1.getEnvLoggerLevels)(),
            });
        }
        catch (err) {
            this.closeCleanup();
            console.error(cli_color_1.default.red('Failed to create app'), cli_color_1.default.red(err));
            throw new Error('Process aborted');
        }
        return this.setApp(app);
    }
}
exports.StandaloneAppBootstrap = StandaloneAppBootstrap;
//# sourceMappingURL=app-bootstrap-standalone.helper.js.map