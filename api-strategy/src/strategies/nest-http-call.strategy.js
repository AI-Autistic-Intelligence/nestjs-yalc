"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestHttpCallStrategyProvider = exports.NestHttpCallStrategy = void 0;
const axios_1 = require("@nestjs/axios");
const http_abstract_call_strategy_js_1 = require("./http-abstract-call.strategy.js");
const cls_module_js_1 = require("@nestjs-yalc/app/cls.module.js");
const header_whitelist_helper_js_1 = require("../header-whitelist.helper.js");
class NestHttpCallStrategy extends http_abstract_call_strategy_js_1.HttpAbstractStrategy {
    constructor(httpService, clsService, baseUrl = '', options = {}) {
        var _a;
        super();
        this.httpService = httpService;
        this.clsService = clsService;
        this.baseUrl = baseUrl;
        this.options = options;
        this.internalHeader =
            (_a = options.internalRequestHeader) !== null && _a !== void 0 ? _a : 'x-internal-request-token';
        this.internalToken = options.internalRequestToken;
    }
    async call(path, options) {
        var _a;
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
            signal: options === null || options === void 0 ? void 0 : options.signal,
            data: options === null || options === void 0 ? void 0 : options.data,
        };
        if (options === null || options === void 0 ? void 0 : options.parameters) {
            _options.params = new URLSearchParams(options.parameters);
        }
        const _b = await this.httpService.axiosRef.request({
            headers: _options === null || _options === void 0 ? void 0 : _options.headers,
            method: _options === null || _options === void 0 ? void 0 : _options.method,
            signal: _options === null || _options === void 0 ? void 0 : _options.signal,
            data: _options === null || _options === void 0 ? void 0 : _options.data,
            params: _options === null || _options === void 0 ? void 0 : _options.params,
            url: `${this.baseUrl}${path}`,
        }), { data } = _b, res = __rest(_b, ["data"]);
        return Object.assign(Object.assign({}, res), { headers: res.headers, data });
    }
}
exports.NestHttpCallStrategy = NestHttpCallStrategy;
const NestHttpCallStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (httpAdapter, clsService) => {
        const _options = Object.assign({ baseUrl: '', NestHttpStrategy: NestHttpCallStrategy }, options);
        return new _options.NestHttpStrategy(httpAdapter, clsService, _options.baseUrl, _options);
    },
    inject: [axios_1.HttpService, cls_module_js_1.YalcGlobalClsService],
});
exports.NestHttpCallStrategyProvider = NestHttpCallStrategyProvider;
//# sourceMappingURL=nest-http-call.strategy.js.map