"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBootstrap = void 0;
const tslib_1 = require("tslib");
const index_js_1 = require("@nest-yalc-2/errors/filters/index.js");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const cookie_1 = tslib_1.__importDefault(require("@fastify/cookie"));
const swagger_1 = require("@nestjs/swagger");
const fastify_1 = require("fastify");
const env_helper_js_1 = require("@nest-yalc-2/utils/env.helper.js");
const class_validator_1 = require("class-validator");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const app_bootstrap_base_helper_js_1 = require("./app-bootstrap-base.helper.js");
const logger_helper_js_1 = require("@nest-yalc-2/logger/logger.helper.js");
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
            createOptions: options?.createOptions,
        });
        return this.initSetup({
            fastifyInstance: this.fastifyInstance,
            createOptions: options?.createOptions,
        });
    }
    async initSetup(options) {
        try {
            await this.applyBootstrapGlobals(options?.createOptions);
            await this.getApp().init();
        }
        catch (err) {
            console.error('App init failed:', err);
            this.closeCleanup();
            throw new Error('Process aborted');
        }
        if ((0, env_helper_js_1.envIsTrue)(process.env.APP_DRY_RUN) === true) {
            this.loggerService?.log('Dry run, exiting...');
            await this.closeApp();
            process.exit(0);
        }
        return this;
    }
    async createApp(options) {
        this.fastifyInstance = options?.fastifyInstance ?? (0, fastify_1.fastify)();
        let app;
        try {
            app = await core_1.NestFactory.create(this.module, new platform_fastify_1.FastifyAdapter(this.fastifyInstance), {
                bufferLogs: false,
                abortOnError: options?.createOptions?.abortOnError ?? false,
                logger: (0, logger_helper_js_1.getEnvLoggerLevels)(),
                ...(options?.createOptions ?? {}),
            });
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
        await super.applyBootstrapGlobals(options);
        this.getApp().useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: false },
            validateCustomDecorators: true,
            exceptionFactory: (errors) => {
                const errorMessages = {};
                errors.forEach((error) => {
                    errorMessages[error.property] = error;
                });
                return new common_1.BadRequestException(errorMessages);
            },
            ...(options?.validationPipeOptions ?? {}),
        }));
        this.getApp().setGlobalPrefix(options?.apiPrefix ?? (this.getConf()?.apiPrefix || ''));
        await this.getApp().register(cookie_1.default, {});
        this.getApp().useGlobalInterceptors(new unwrap_result_interceptor_js_1.UnwrapResultInterceptor());
        const filters = [
            new index_js_1.SystemExceptionFilter(this.loggerService),
            ...(options?.filters ?? []),
        ];
        this.getApp().useGlobalFilters(...filters);
        if (options?.enableSwagger) {
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
        const port = this.getConf()?.port || 0;
        const host = this.getConf()?.host || '0.0.0.0';
        let apiPrefix = this.getConf()?.apiPrefix;
        apiPrefix = apiPrefix ? `/${apiPrefix}` : '';
        const domain = this.getConf()?.domain || 'localhost';
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
            callback?.(port, host, domain);
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
    const normalized = (path ?? 'api').replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized || 'api';
}
//# sourceMappingURL=app-bootstrap.helper.js.map