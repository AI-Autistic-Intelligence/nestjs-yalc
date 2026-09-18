"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSimpleMapperInterceptor = buildSimpleMapperInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
function buildSimpleMapperInterceptor(Dto, options) {
    let SimpleMapper = class SimpleMapper {
        intercept(_context, next) {
            return next.handle().pipe((0, rxjs_1.map)((data) => {
                const tData = options?.transformer?.(data) ?? data;
                const mappedData = Array.isArray(tData)
                    ? tData.map((d) => new Dto(d))
                    : new Dto(tData);
                return options?.callback?.(data, mappedData) ?? mappedData;
            }));
        }
    };
    SimpleMapper = tslib_1.__decorate([
        (0, common_1.Injectable)()
    ], SimpleMapper);
    return SimpleMapper;
}
//# sourceMappingURL=simple-mapper.interceptor.js.map