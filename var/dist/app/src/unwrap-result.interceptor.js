import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { map } from 'rxjs';
let UnwrapResultInterceptor = class UnwrapResultInterceptor {
    intercept(_, next) {
        return next.handle().pipe(map((result) => {
            if (result instanceof ResultAsync ||
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
UnwrapResultInterceptor = __decorate([
    Injectable()
], UnwrapResultInterceptor);
export { UnwrapResultInterceptor };
//# sourceMappingURL=unwrap-result.interceptor.js.map