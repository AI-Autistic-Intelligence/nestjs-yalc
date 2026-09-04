import { HttpService } from '@nestjs/axios';
import { HttpAbstractStrategy, } from './http-abstract-call.strategy.js';
import { YalcGlobalClsService } from '@nestjs-yalc/app/cls.module.js';
import { filterHeaders } from '../header-whitelist.helper.js';
export class NestHttpCallStrategy extends HttpAbstractStrategy {
    constructor(httpService, clsService, baseUrl = '', options = {}) {
        super();
        this.httpService = httpService;
        this.clsService = clsService;
        this.baseUrl = baseUrl;
        this.options = options;
        this.internalHeader =
            options.internalRequestHeader ?? 'x-internal-request-token';
        this.internalToken = options.internalRequestToken;
    }
    async call(path, options) {
        const clsHeaders = filterHeaders(this.clsService.get('headers'), this.options.headersWhitelist);
        const headers = {
            ...clsHeaders,
            ...(options?.headers ?? {}),
        };
        if (this.internalHeader &&
            this.internalToken &&
            !headers[this.internalHeader]) {
            headers[this.internalHeader] = this.internalToken;
        }
        const _options = {
            headers,
            method: options?.method,
            signal: options?.signal,
            data: options?.data,
        };
        if (options?.parameters) {
            _options.params = new URLSearchParams(options.parameters);
        }
        const { data, ...res } = await this.httpService.axiosRef.request({
            headers: _options?.headers,
            method: _options?.method,
            signal: _options?.signal,
            data: _options?.data,
            params: _options?.params,
            url: `${this.baseUrl}${path}`,
        });
        return {
            ...res,
            headers: res.headers,
            data,
        };
    }
}
export const NestHttpCallStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (httpAdapter, clsService) => {
        const _options = {
            baseUrl: '',
            NestHttpStrategy: NestHttpCallStrategy,
            ...options,
        };
        return new _options.NestHttpStrategy(httpAdapter, clsService, _options.baseUrl, _options);
    },
    inject: [HttpService, YalcGlobalClsService],
});
//# sourceMappingURL=nest-http-call.strategy.js.map