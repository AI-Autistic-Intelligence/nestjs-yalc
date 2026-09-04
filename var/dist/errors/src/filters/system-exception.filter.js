import { __decorate, __metadata } from "tslib";
import { Catch } from '@nestjs/common';
import { ExceptionContextEnum } from '../error.enum.js';
let SystemExceptionFilter = class SystemExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error) {
        this.logger.error(error, error.stack, ExceptionContextEnum.SYSTEM);
        return error;
    }
};
SystemExceptionFilter = __decorate([
    Catch(TypeError, SyntaxError, RangeError, EvalError, ReferenceError),
    __metadata("design:paramtypes", [Object])
], SystemExceptionFilter);
export { SystemExceptionFilter };
//# sourceMappingURL=system-exception.filter.js.map