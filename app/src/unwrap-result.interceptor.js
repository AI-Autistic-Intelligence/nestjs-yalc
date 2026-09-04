"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnwrapResultInterceptor = void 0;
const common_1 = require("@nestjs/common");
const neverthrow_1 = require("neverthrow");
const rxjs_1 = require("rxjs");
let UnwrapResultInterceptor = class UnwrapResultInterceptor {
    intercept(_, next) {
        return next.handle().pipe((0, rxjs_1.map)((result) => {
            if (result instanceof neverthrow_1.ResultAsync ||
                (!!result &&
                    typeof result === 'object' &&
                    typeof result.isOk === 'function' &&
                    typeof result.isErr === 'function')) {
                if (result.isOk()) {
                    return result.value;
                }
                else {
                    throw result.error;
                }
            }
            return result;
        }));
    }
};
exports.UnwrapResultInterceptor = UnwrapResultInterceptor;
exports.UnwrapResultInterceptor = UnwrapResultInterceptor = __decorate([
    (0, common_1.Injectable)()
], UnwrapResultInterceptor);
//# sourceMappingURL=unwrap-result.interceptor.js.map