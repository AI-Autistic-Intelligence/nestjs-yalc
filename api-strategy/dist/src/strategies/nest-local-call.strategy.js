"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestLocalCallStrategyProvider = exports.NestLocalCallStrategy = void 0;
const core_1 = require("@nestjs/core");
const http_abstract_call_strategy_js_1 = require("./http-abstract-call.strategy.js");
const cls_module_js_1 = require("@nest-yalc-2/app/cls.module.js");
const header_whitelist_helper_js_1 = require("../header-whitelist.helper.js");
const def_const_js_1 = require("@nest-yalc-2/app/def.const.js");
class NestLocalCallStrategy extends http_abstract_call_strategy_js_1.HttpAbstractStrategy {
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
exports.NestLocalCallStrategy = NestLocalCallStrategy;
const NestLocalCallStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (httpAdapter, clsService, configService) => {
        const _options = {
            baseUrl: '',
            NestLocalStrategy: NestLocalCallStrategy,
            ...options,
        };
        return new _options.NestLocalStrategy(httpAdapter, clsService, configService, _options.baseUrl, _options);
    },
    inject: [core_1.HttpAdapterHost, cls_module_js_1.YalcGlobalClsService, def_const_js_1.MAIN_APP_CONFIG_SERVICE],
});
exports.NestLocalCallStrategyProvider = NestLocalCallStrategyProvider;
//# sourceMappingURL=nest-local-call.strategy.js.map