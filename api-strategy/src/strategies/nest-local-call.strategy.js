"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestLocalCallStrategyProvider = exports.NestLocalCallStrategy = void 0;
const core_1 = require("@nestjs/core");
const http_abstract_call_strategy_js_1 = require("./http-abstract-call.strategy.js");
const cls_module_js_1 = require("@nestjs-yalc/app/cls.module.js");
const header_whitelist_helper_js_1 = require("../header-whitelist.helper.js");
const def_const_js_1 = require("@nestjs-yalc/app/def.const.js");
class NestLocalCallStrategy extends http_abstract_call_strategy_js_1.HttpAbstractStrategy {
    constructor(adapterHost, clsService, configService, baseUrl = '', options = {}) {
        var _a, _b, _c;
        super();
        this.adapterHost = adapterHost;
        this.clsService = clsService;
        this.configService = configService;
        this.baseUrl = baseUrl;
        this.options = options;
        this.internalHeader =
            (_a = options.internalRequestHeader) !== null && _a !== void 0 ? _a : 'x-internal-request-token';
        this.internalToken =
            (_b = options.internalRequestToken) !== null && _b !== void 0 ? _b : (_c = configService === null || configService === void 0 ? void 0 : configService.values) === null || _c === void 0 ? void 0 : _c.internalRequestToken;
    }
    async call(path, options) {
        var _a;
        const instance = this.adapterHost.httpAdapter.getInstance();
        const clsHeaders = (0, header_whitelist_helper_js_1.filterHeaders)(this.clsService.get('headers'), this.options.headersWhitelist);
        const headers = Object.assign(Object.assign({}, clsHeaders), ((_a = options === null || options === void 0 ? void 0 : options.headers) !== null && _a !== void 0 ? _a : {}));
        if (this.internalHeader &&
            this.internalToken &&
            !headers[this.internalHeader]) {
            headers[this.internalHeader] = this.internalToken;
        }
        const _options = {
            headers,
            method: options === null || options === void 0 ? void 0 : options.method,
            payload: options === null || options === void 0 ? void 0 : options.data,
        };
        const args = Object.assign(Object.assign({}, _options), { url: `${this.baseUrl}${path}` });
        if (options === null || options === void 0 ? void 0 : options.parameters) {
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
        const _options = Object.assign({ baseUrl: '', NestLocalStrategy: NestLocalCallStrategy }, options);
        return new _options.NestLocalStrategy(httpAdapter, clsService, configService, _options.baseUrl, _options);
    },
    inject: [core_1.HttpAdapterHost, cls_module_js_1.YalcGlobalClsService, def_const_js_1.MAIN_APP_CONFIG_SERVICE],
});
exports.NestLocalCallStrategyProvider = NestLocalCallStrategyProvider;
//# sourceMappingURL=nest-local-call.strategy.js.map