import { HttpService } from '@nestjs/axios';
import { HttpAbstractStrategy, } from './http-abstract-call.strategy.js';
import { YalcGlobalClsService } from '@nest-yalc-2/app/cls.module.js';
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
        if (options.internalRequestToken !== undefined) {
            this.internalToken = options.internalRequestToken;
        }
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
        /**
         * We need this to do a type check on the options and
         * implement the mapping from HttpOptions to AxiosRequestConfig
         */
        const _options = {
            ...(headers !== undefined ? { headers: headers } : {}),
            ...(options?.method !== undefined ? { method: options.method } : {}),
            ...(options?.signal !== undefined ? { signal: options.signal } : {}),
            ...(options?.data !== undefined ? { data: options.data } : {}),
        };
        if (options?.parameters) {
            _options.params = new URLSearchParams(options.parameters);
        }
        const { data, ...res } = await this.httpService.axiosRef.request({
            ..._options,
            headers: _options?.headers,
            url: `${this.baseUrl}${path}`,
        });
        return {
            ...res,
            headers: res.headers,
            data,
        };
    }
}
/**
 * Just a convenient provider to inject the NestLocalCallStrategy
 */
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