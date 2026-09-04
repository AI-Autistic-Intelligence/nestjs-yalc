import { SystemExceptionFilter } from '@nestjs-yalc/errors/filters/index.js';
import { BadRequestException, ValidationPipe, } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { fastify } from 'fastify';
import { envIsTrue } from '@nestjs-yalc/utils/env.helper.js';
import { useContainer } from 'class-validator';
import clc from 'cli-color';
import { BaseAppBootstrap, } from './app-bootstrap-base.helper.js';
import { getEnvLoggerLevels } from '@nestjs-yalc/logger/logger.helper.js';
import { UnwrapResultInterceptor } from './unwrap-result.interceptor.js';
export class AppBootstrap extends BaseAppBootstrap {
    constructor(appAlias, module, options) {
        super(appAlias, module, { globalsOptions: options });
        this.isSwaggerEnabled = false;
        this.swaggerPath = 'api';
    }
    async startServer(options) {
        await this.initApp(options);
        if (envIsTrue(process.env.APP_DRY_RUN) === true) {
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
            this.closeCleanup();
            throw new Error('Process aborted');
        }
        if (envIsTrue(process.env.APP_DRY_RUN) === true) {
            this.loggerService?.log('Dry run, exiting...');
            await this.closeApp();
            process.exit(0);
        }
        return this;
    }
    async createApp(options) {
        this.fastifyInstance = options?.fastifyInstance ?? fastify();
        let app;
        try {
            app = await NestFactory.create(this.module, new FastifyAdapter(this.fastifyInstance), {
                bufferLogs: false,
                abortOnError: options?.createOptions?.abortOnError ?? false,
                logger: getEnvLoggerLevels(),
                ...(options?.createOptions ?? {}),
            });
        }
        catch (err) {
            this.closeCleanup();
            console.error(clc.red('Failed to create app'), clc.red(err));
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
        this.getApp().useGlobalPipes(new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: false },
            validateCustomDecorators: true,
            exceptionFactory: (errors) => {
                const errorMessages = {};
                errors.forEach((error) => {
                    errorMessages[error.property] = error;
                });
                return new BadRequestException(errorMessages);
            },
            ...(options?.validationPipeOptions ?? {}),
        }));
        this.getApp().setGlobalPrefix(options?.apiPrefix ?? (this.getConf()?.apiPrefix || ''));
        await this.getApp().register(fastifyCookie, {});
        this.getApp().useGlobalInterceptors(new UnwrapResultInterceptor());
        const filters = [
            new SystemExceptionFilter(this.loggerService),
            ...(options?.filters ?? []),
        ];
        this.getApp().useGlobalFilters(...filters);
        if (options?.enableSwagger) {
            const swaggerPath = sanitizeSwaggerPath(options.swaggerPath);
            this.swaggerPath = swaggerPath;
            this.setSwaggerEnabled(true);
            const document = SwaggerModule.createDocument(this.getApp(), this.buildSwaggerConfig().build());
            SwaggerModule.setup(swaggerPath, this.getApp(), document, {
                jsonDocumentUrl: `/${swaggerPath}/json`,
                useGlobalPrefix: true,
            });
        }
        useContainer(this.getApp().select(this.getModule()), {
            fallbackOnErrors: true,
        });
        return this;
    }
    buildSwaggerConfig() {
        return new DocumentBuilder()
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
function sanitizeSwaggerPath(path) {
    const normalized = (path ?? 'api').replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized || 'api';
}
//# sourceMappingURL=app-bootstrap.helper.js.map