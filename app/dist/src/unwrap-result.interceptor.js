"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnwrapResultInterceptor = void 0;
const tslib_1 = require("tslib");
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
exports.UnwrapResultInterceptor = UnwrapResultInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UnwrapResultInterceptor);
//# sourceMappingURL=unwrap-result.interceptor.js.map