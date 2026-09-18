"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestHttpCallStrategyProvider = exports.NestHttpCallStrategy = void 0;
const axios_1 = require("@nestjs/axios");
const http_abstract_call_strategy_js_1 = require("./http-abstract-call.strategy.js");
const cls_module_js_1 = require("@nest-yalc-2/app/cls.module.js");
const header_whitelist_helper_js_1 = require("../header-whitelist.helper.js");
class NestHttpCallStrategy extends http_abstract_call_strategy_js_1.HttpAbstractStrategy {
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
        const clsHeaders = (0, header_whitelist_helper_js_1.filterHeaders)(this.clsService.get('headers'), this.options.headersWhitelist);
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
exports.NestHttpCallStrategy = NestHttpCallStrategy;
const NestHttpCallStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (httpAdapter, clsService) => {
        const _options = {
            baseUrl: '',
            NestHttpStrategy: NestHttpCallStrategy,
            ...options,
        };
        return new _options.NestHttpStrategy(httpAdapter, clsService, _options.baseUrl, _options);
    },
    inject: [axios_1.HttpService, cls_module_js_1.YalcGlobalClsService],
});
exports.NestHttpCallStrategyProvider = NestHttpCallStrategyProvider;
//# sourceMappingURL=nest-http-call.strategy.js.map