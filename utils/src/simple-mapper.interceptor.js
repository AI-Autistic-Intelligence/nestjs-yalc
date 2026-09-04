"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSimpleMapperInterceptor = buildSimpleMapperInterceptor;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
function buildSimpleMapperInterceptor(Dto, options) {
    let SimpleMapper = class SimpleMapper {
        intercept(_context, next) {
            return next.handle().pipe((0, rxjs_1.map)((data) => {
                var _a, _b, _c, _d;
                const tData = (_b = (_a = options === null || options === void 0 ? void 0 : options.transformer) === null || _a === void 0 ? void 0 : _a.call(options, data)) !== null && _b !== void 0 ? _b : data;
                const mappedData = Array.isArray(tData)
                    ? tData.map((d) => new Dto(d))
                    : new Dto(tData);
                return (_d = (_c = options === null || options === void 0 ? void 0 : options.callback) === null || _c === void 0 ? void 0 : _c.call(options, data, mappedData)) !== null && _d !== void 0 ? _d : mappedData;
            }));
        }
    };
    SimpleMapper = __decorate([
        (0, common_1.Injectable)()
    ], SimpleMapper);
    return SimpleMapper;
}
//# sourceMappingURL=simple-mapper.interceptor.js.map