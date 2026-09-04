import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs';
import { objectMapper } from './object-mapper.helper.js';
export function objectMapperInterceptor(mapper, options = {}) {
    let ObjectMapperInterceptor = class ObjectMapperInterceptor {
        intercept(_context, next) {
            return next.handle().pipe(map((data) => {
                const _data = options.transformData
                    ? options.transformData(data)
                    : data;
                if (Array.isArray(_data)) {
                    const result = _data.map((item) => objectMapper(item, mapper));
                    return options.callback?.(data, result) ?? result;
                }
                const result = objectMapper(_data, mapper, {
                    copyNonMappedProperties: options.copyNonMappedProperties,
                });
                return options.callback?.(data, result) ?? result;
            }));
        }
    };
    ObjectMapperInterceptor = __decorate([
        Injectable()
    ], ObjectMapperInterceptor);
    return ObjectMapperInterceptor;
}
//# sourceMappingURL=object-mapper.interceptor.js.map