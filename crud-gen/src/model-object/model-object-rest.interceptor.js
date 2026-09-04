"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelFieldMapperInterceptor = modelFieldMapperInterceptor;
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
    ModelFieldMapperInterceptor = __decorate([
        (0, common_1.Injectable)()
    ], ModelFieldMapperInterceptor);
    return ModelFieldMapperInterceptor;
}
//# sourceMappingURL=model-object-rest.interceptor.js.map