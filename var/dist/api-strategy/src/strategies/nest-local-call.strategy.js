import { HttpAdapterHost } from '@nestjs/core';
import { HttpAbstractStrategy, } from './http-abstract-call.strategy.js';
import { YalcGlobalClsService } from '@nestjs-yalc/app/cls.module.js';
import { filterHeaders } from '../header-whitelist.helper.js';
import { MAIN_APP_CONFIG_SERVICE } from '@nestjs-yalc/app/def.const.js';
export class NestLocalCallStrategy extends HttpAbstractStrategy {
    constructor(adapterHost, clsService, configService, baseUrl = '', options = {}) {
        super();
        this.adapterHost = adapterHost;
        this.clsService = clsService;
        this.configService = configService;
        this.baseUrl = baseUrl;
        this.options = options;
        this.internalHeader =
            options.internalRequestHeader ?? 'x-internal-request-token';
        this.internalToken =
            options.internalRequestToken ??
                configService?.values?.internalRequestToken;
    }
    async call(path, options) {
        const instance = this.adapterHost.httpAdapter.getInstance();
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
            payload: options?.data,
        };
        const args = {
            ..._options,
            url: `${this.baseUrl}${path}`,
        };
        if (options?.parameters) {
            args.query = Object.fromEntries(new URLSearchParams(options.parameters));
        }
        const result = await instance.inject(args);
        let data;
        try {
            if (this.options.shouldSkipJsonParse &&
                this.options.shouldSkipJsonParse(result.body)) {
                data = result.body;
            }
            else {
                data = result.json();
            }
        }
        catch (_e) {
            data = result.body;
        }
        return {
            data,
            headers: result.headers,
            status: result.statusCode,
            statusText: result.statusMessage,
            request: result.payload,
        };
    }
}
export const NestLocalCallStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (httpAdapter, clsService, configService) => {
        const _options = {
            baseUrl: '',
            NestLocalStrategy: NestLocalCallStrategy,
            ...options,
        };
        return new _options.NestLocalStrategy(httpAdapter, clsService, configService, _options.baseUrl, _options);
    },
    inject: [HttpAdapterHost, YalcGlobalClsService, MAIN_APP_CONFIG_SERVICE],
});
//# sourceMappingURL=nest-local-call.strategy.js.map