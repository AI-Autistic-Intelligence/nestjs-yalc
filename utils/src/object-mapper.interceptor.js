"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMapperInterceptor = objectMapperInterceptor;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const object_mapper_helper_js_1 = require("./object-mapper.helper.js");
function objectMapperInterceptor(mapper, options = {}) {
    let ObjectMapperInterceptor = class ObjectMapperInterceptor {
        intercept(_context, next) {
            return next.handle().pipe((0, rxjs_1.map)((data) => {
                const _data = options.transformData
                    ? options.transformData(data)
                    : data;
                if (Array.isArray(_data)) {
                    const result = _data.map((item) => (0, object_mapper_helper_js_1.objectMapper)(item, mapper));
                    return options.callback?.(data, result) ?? result;
                }
                const result = (0, object_mapper_helper_js_1.objectMapper)(_data, mapper, {
                    copyNonMappedProperties: options.copyNonMappedProperties,
                });
                return options.callback?.(data, result) ?? result;
            }));
        }
    };
    ObjectMapperInterceptor = __decorate([
        (0, common_1.Injectable)()
    ], ObjectMapperInterceptor);
    return ObjectMapperInterceptor;
}
//# sourceMappingURL=object-mapper.interceptor.js.map