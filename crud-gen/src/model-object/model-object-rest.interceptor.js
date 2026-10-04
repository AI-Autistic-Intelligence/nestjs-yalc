import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { modelFieldToDest } from './model-object.helper.js';
export function modelFieldMapperInterceptor(inputClass, outputClass) {
    let ModelFieldMapperInterceptor = class ModelFieldMapperInterceptor {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            if (request.body) {
                const mappedInput = modelFieldToDest(inputClass, outputClass);
                context.switchToHttp().getRequest().body = mappedInput;
            }
            return next.handle().pipe(map((data) => {
                return modelFieldToDest(data, outputClass);
            }));
        }
    };
    ModelFieldMapperInterceptor = __decorate([
        Injectable()
    ], ModelFieldMapperInterceptor);
    return ModelFieldMapperInterceptor;
}
//# sourceMappingURL=model-object-rest.interceptor.js.map