import { ExceptionFilter, NestApplicationOptions, ValidationPipeOptions } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder } from '@nestjs/swagger';
import { FastifyInstance } from 'fastify';
import { BaseAppBootstrap, IGlobalOptions } from './app-bootstrap-base.helper.js';
export interface ICreateOptions {
    enableSwagger?: boolean;
    /**
     * Path segment (without leading slash) where Swagger UI/JSON is exposed.
     * Defaults to "api".
     */
    swaggerPath?: string;
    filters?: ExceptionFilter[];
    validationPipeOptions?: ValidationPipeOptions;
    /**
     * On some cases we do want to manually override the apiPrefix of the service conf
     */
    apiPrefix?: string;
}
export interface INestCreateOptions extends ICreateOptions, NestApplicationOptions {
}
export declare class AppBootstrap<TGlobalOptions extends IGlobalOptions = IGlobalOptions> extends BaseAppBootstrap<NestFastifyApplication> {
    private fastifyInstance?;
    protected isSwaggerEnabled: boolean;
    protected swaggerPath: string;
    constructor(appAlias: string, module: any, options?: TGlobalOptions);
    startServer(options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    initApp(options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    initSetup(options?: {
        createOptions?: ICreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    createApp(options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    getFastifyInstance(): FastifyInstance<import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> | undefined;
    setSwaggerEnabled(enabled: boolean): void;
    applyBootstrapGlobals(options?: ICreateOptions): Promise<this>;
    buildSwaggerConfig(): DocumentBuilder;
    listen(callback?: {
        (port: number, host: string, domain: string): void;
    }): Promise<void>;
}
