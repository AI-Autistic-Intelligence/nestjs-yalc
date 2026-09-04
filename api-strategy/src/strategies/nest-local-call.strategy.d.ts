import { HttpAdapterHost } from '@nestjs/core';
import { HttpAbstractStrategy, HttpOptions, IHttpCallStrategyOptions, IHttpCallStrategyResponse } from './http-abstract-call.strategy.js';
import { ClassType } from '@nestjs-yalc/types/globals.d.js';
import { YalcGlobalClsService } from '@nestjs-yalc/app/cls.module.js';
import { AppConfigService } from '@nestjs-yalc/app/app-config.service.js';
export type NestLocalCallStrategyOptions = IHttpCallStrategyOptions & {
    internalRequestHeader?: string;
    internalRequestToken?: string;
};
export declare class NestLocalCallStrategy extends HttpAbstractStrategy {
    protected readonly adapterHost: HttpAdapterHost;
    protected readonly clsService: YalcGlobalClsService;
    protected readonly configService: AppConfigService;
    private baseUrl;
    protected readonly options: NestLocalCallStrategyOptions;
    private readonly internalHeader;
    private readonly internalToken?;
    constructor(adapterHost: HttpAdapterHost, clsService: YalcGlobalClsService, configService: AppConfigService, baseUrl?: string, options?: NestLocalCallStrategyOptions);
    call<TOptData extends string | object | Buffer | NodeJS.ReadableStream, TParams extends Record<string, any>, TResData>(path: string, options?: HttpOptions<TOptData, TParams>): Promise<IHttpCallStrategyResponse<TResData>>;
}
export interface NestLocalCallStrategyProviderOptions {
    baseUrl?: string;
    NestLocalStrategy?: ClassType<NestLocalCallStrategy>;
    headersWhitelist?: string[];
    internalRequestHeader?: string;
    internalRequestToken?: string;
}
export declare const NestLocalCallStrategyProvider: (provide: string, options?: NestLocalCallStrategyProviderOptions) => {
    provide: string;
    useFactory: (httpAdapter: HttpAdapterHost, clsService: YalcGlobalClsService, configService: AppConfigService) => NestLocalCallStrategy;
    inject: (string | typeof YalcGlobalClsService | typeof HttpAdapterHost)[];
};
