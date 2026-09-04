import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs';
export function buildSimpleMapperInterceptor(Dto, options) {
    let SimpleMapper = class SimpleMapper {
        intercept(_context, next) {
            return next.handle().pipe(map((data) => {
                const tData = options?.transformer?.(data) ?? data;
                const mappedData = Array.isArray(tData)
                    ? tData.map((d) => new Dto(d))
                    : new Dto(tData);
                return options?.callback?.(data, mappedData) ?? mappedData;
            }));
        }
    };
    SimpleMapper = __decorate([
        Injectable()
    ], SimpleMapper);
    return SimpleMapper;
}
//# sourceMappingURL=simple-mapper.interceptor.js.map