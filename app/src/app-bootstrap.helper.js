"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBootstrap = void 0;
const index_js_1 = require("@nestjs-yalc/errors/filters/index.js");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const swagger_1 = require("@nestjs/swagger");
const fastify_1 = require("fastify");
const env_helper_js_1 = require("@nestjs-yalc/utils/env.helper.js");
const class_validator_1 = require("class-validator");
const cli_color_1 = __importDefault(require("cli-color"));
const app_bootstrap_base_helper_js_1 = require("./app-bootstrap-base.helper.js");
const logger_helper_js_1 = require("@nestjs-yalc/logger/logger.helper.js");
const unwrap_result_interceptor_js_1 = require("./unwrap-result.interceptor.js");
class AppBootstrap extends app_bootstrap_base_helper_js_1.BaseAppBootstrap {
    constructor(appAlias, module, options) {
        super(appAlias, module, { globalsOptions: options });
        this.isSwaggerEnabled = false;
        this.swaggerPath = 'api';
    }
    async startServer(options) {
        await this.initApp(options);
        if ((0, env_helper_js_1.envIsTrue)(process.env.APP_DRY_RUN) === true) {
            await this.closeApp();
            process.exit(0);
        }
        this.listen();
        return this;
    }
    async initApp(options) {
        await this.createApp({
            fastifyInstance: this.fastifyInstance,
            createOptions: options === null || options === void 0 ? void 0 : options.createOptions,
        });
        return this.initSetup({
            fastifyInstance: this.fastifyInstance,
            createOptions: options === null || options === void 0 ? void 0 : options.createOptions,
        });
    }
    async initSetup(options) {
        var _a;
        try {
            await this.applyBootstrapGlobals(options === null || options === void 0 ? void 0 : options.createOptions);
            await this.getApp().init();
        }
        catch (err) {
            console.error('App init failed:', err);
            this.closeCleanup();
            throw new Error('Process aborted');
        }
        if ((0, env_helper_js_1.envIsTrue)(process.env.APP_DRY_RUN) === true) {
            (_a = this.loggerService) === null || _a === void 0 ? void 0 : _a.log('Dry run, exiting...');
            await this.closeApp();
            process.exit(0);
        }
        return this;
    }
    async createApp(options) {
        var _a, _b, _c, _d;
        this.fastifyInstance = (_a = options === null || options === void 0 ? void 0 : options.fastifyInstance) !== null && _a !== void 0 ? _a : (0, fastify_1.fastify)();
        let app;
        try {
            app = await core_1.NestFactory.create(this.module, new platform_fastify_1.FastifyAdapter(this.fastifyInstance), Object.assign({ bufferLogs: false, abortOnError: (_c = (_b = options === null || options === void 0 ? void 0 : options.createOptions) === null || _b === void 0 ? void 0 : _b.abortOnError) !== null && _c !== void 0 ? _c : false, logger: (0, logger_helper_js_1.getEnvLoggerLevels)() }, ((_d = options === null || options === void 0 ? void 0 : options.createOptions) !== null && _d !== void 0 ? _d : {})));
        }
        catch (err) {
            this.closeCleanup();
            console.error(cli_color_1.default.red('Failed to create app'), cli_color_1.default.red(err));
            throw new Error('Process aborted');
        }
        return this.setApp(app);
    }
    getFastifyInstance() {
        return this.fastifyInstance;
    }
    setSwaggerEnabled(enabled) {
        this.isSwaggerEnabled = enabled;
    }
    async applyBootstrapGlobals(options) {
        var _a, _b, _c, _d;
        await super.applyBootstrapGlobals(options);
        this.getApp().useGlobalPipes(new common_1.ValidationPipe(Object.assign({ transform: true, transformOptions: { enableImplicitConversion: false }, validateCustomDecorators: true, exceptionFactory: (errors) => {
                const errorMessages = {};
                errors.forEach((error) => {
                    errorMessages[error.property] = error;
                });
                return new common_1.BadRequestException(errorMessages);
            } }, ((_a = options === null || options === void 0 ? void 0 : options.validationPipeOptions) !== null && _a !== void 0 ? _a : {}))));
        this.getApp().setGlobalPrefix((_b = options === null || options === void 0 ? void 0 : options.apiPrefix) !== null && _b !== void 0 ? _b : (((_c = this.getConf()) === null || _c === void 0 ? void 0 : _c.apiPrefix) || ''));
        await this.getApp().register(cookie_1.default, {});
        this.getApp().useGlobalInterceptors(new unwrap_result_interceptor_js_1.UnwrapResultInterceptor());
        const filters = [
            new index_js_1.SystemExceptionFilter(this.loggerService),
            ...((_d = options === null || options === void 0 ? void 0 : options.filters) !== null && _d !== void 0 ? _d : []),
        ];
        this.getApp().useGlobalFilters(...filters);
        if (options === null || options === void 0 ? void 0 : options.enableSwagger) {
            const swaggerPath = sanitizeSwaggerPath(options.swaggerPath);
            this.swaggerPath = swaggerPath;
            this.setSwaggerEnabled(true);
            const document = swagger_1.SwaggerModule.createDocument(this.getApp(), this.buildSwaggerConfig().build());
            swagger_1.SwaggerModule.setup(swaggerPath, this.getApp(), document, {
                jsonDocumentUrl: `/${swaggerPath}/json`,
                useGlobalPrefix: true,
            });
        }
        (0, class_validator_1.useContainer)(this.getApp().select(this.getModule()), {
            fallbackOnErrors: true,
        });
        return this;
    }
    buildSwaggerConfig() {
        return new swagger_1.DocumentBuilder()
            .setTitle(this.appAlias)
            .setDescription(`${this.appAlias} rest api`);
    }
    async listen(callback) {
        var _a, _b, _c, _d;
        const port = ((_a = this.getConf()) === null || _a === void 0 ? void 0 : _a.port) || 0;
        const host = ((_b = this.getConf()) === null || _b === void 0 ? void 0 : _b.host) || '0.0.0.0';
        let apiPrefix = (_c = this.getConf()) === null || _c === void 0 ? void 0 : _c.apiPrefix;
        apiPrefix = apiPrefix ? `/${apiPrefix}` : '';
        const domain = ((_d = this.getConf()) === null || _d === void 0 ? void 0 : _d.domain) || 'localhost';
        await this.getApp().listen(port, host, async (_err, address) => {
            console.debug(`Server ${this.appAlias} listening on
        http://localhost:${port}${apiPrefix}/
        http://127.0.0.1:${port}${apiPrefix}/
        http://${domain}:${port}${apiPrefix}/
        ${address}`);
            if (this.isSwaggerEnabled) {
                console.debug(`Swagger ${this.appAlias} listening on
        http://localhost:${port}${apiPrefix}/${this.swaggerPath}
        http://127.0.0.1:${port}${apiPrefix}/${this.swaggerPath}
        http://${domain}:${port}${apiPrefix}/${this.swaggerPath}
        ${address}/${this.swaggerPath}
        JSON: http://localhost:${port}${apiPrefix}/${this.swaggerPath}/json`);
            }
            callback === null || callback === void 0 ? void 0 : callback(port, host, domain);
        });
        const hmr = typeof module !== 'undefined' ? module.hot : undefined;
        if (hmr) {
            console.debug('Hot reload enabled. Reloading...');
            hmr.accept();
            hmr.dispose(() => this.closeApp());
        }
    }
}
exports.AppBootstrap = AppBootstrap;
function sanitizeSwaggerPath(path) {
    const normalized = (path !== null && path !== void 0 ? path : 'api').replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized || 'api';
}
//# sourceMappingURL=app-bootstrap.helper.js.map