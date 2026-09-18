"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMapperInterceptor = objectMapperInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const object_mapper_helper_1 = require("@node-yalc/utils/object-mapper.helper");
function objectMapperInterceptor(mapper, options = {}) {
    let ObjectMapperInterceptor = class ObjectMapperInterceptor {
        intercept(_context, next) {
            return next.handle().pipe((0, rxjs_1.map)((data) => {
                const _data = options.transformData
                    ? options.transformData(data)
                    : data;
                if (Array.isArray(_data)) {
                    const result = _data.map((item) => (0, object_mapper_helper_1.objectMapper)(item, mapper));
                    return options.callback?.(data, result) ?? result;
                }
                const result = (0, object_mapper_helper_1.objectMapper)(_data, mapper, {
                    copyNonMappedProperties: options.copyNonMappedProperties,
                });
                return options.callback?.(data, result) ?? result;
            }));
        }
    };
    ObjectMapperInterceptor = tslib_1.__decorate([
        (0, common_1.Injectable)()
    ], ObjectMapperInterceptor);
    return ObjectMapperInterceptor;
}
//# sourceMappingURL=object-mapper.interceptor.js.map