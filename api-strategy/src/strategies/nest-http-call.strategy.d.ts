import { ClassType } from '@nestjs-yalc/types/globals.d.js';
import { HttpService } from '@nestjs/axios';
import { HttpAbstractStrategy, IHttpCallStrategyResponse, HttpOptions, IHttpCallStrategyOptions } from './http-abstract-call.strategy.js';
import { YalcGlobalClsService } from '@nestjs-yalc/app/cls.module.js';
export type NestHttpCallStrategyOptions = IHttpCallStrategyOptions & {
    internalRequestHeader?: string;
    internalRequestToken?: string;
};
export declare class NestHttpCallStrategy extends HttpAbstractStrategy {
    protected readonly httpService: HttpService;
    protected readonly clsService: YalcGlobalClsService;
    private baseUrl;
    protected readonly options: NestHttpCallStrategyOptions;
    private readonly internalHeader;
    private readonly internalToken?;
    constructor(httpService: HttpService, clsService: YalcGlobalClsService, baseUrl?: string, options?: NestHttpCallStrategyOptions);
    call<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: HttpOptions<TOptData, TParams>): Promise<IHttpCallStrategyResponse<TResData>>;
}
export interface NestHttpCallStrategyProviderOptions {
    baseUrl?: string;
    NestHttpStrategy?: ClassType<NestHttpCallStrategy>;
    headersWhitelist?: string[];
    internalRequestHeader?: string;
    internalRequestToken?: string;
}
export declare const NestHttpCallStrategyProvider: (provide: string, options?: NestHttpCallStrategyProviderOptions) => {
    provide: string;
    useFactory: (httpAdapter: HttpService, clsService: YalcGlobalClsService) => NestHttpCallStrategy;
    inject: (typeof YalcGlobalClsService | typeof HttpService)[];
};
