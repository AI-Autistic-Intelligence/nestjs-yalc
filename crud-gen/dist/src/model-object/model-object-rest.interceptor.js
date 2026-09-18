"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelFieldMapperInterceptor = modelFieldMapperInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const model_object_helper_js_1 = require("./model-object.helper.js");
function modelFieldMapperInterceptor(inputClass, outputClass) {
    let ModelFieldMapperInterceptor = class ModelFieldMapperInterceptor {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            if (request.body) {
                const mappedInput = (0, model_object_helper_js_1.modelFieldToDest)(inputClass, outputClass);
                context.switchToHttp().getRequest().body = mappedInput;
            }
            return next.handle().pipe((0, operators_1.map)((data) => {
                return (0, model_object_helper_js_1.modelFieldToDest)(data, outputClass);
            }));
        }
    };
    ModelFieldMapperInterceptor = tslib_1.__decorate([
        (0, common_1.Injectable)()
    ], ModelFieldMapperInterceptor);
    return ModelFieldMapperInterceptor;
}
//# sourceMappingURL=model-object-rest.interceptor.js.map