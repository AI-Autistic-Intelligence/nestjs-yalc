"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const error_enum_1 = require("@node-yalc/errors/error.enum");
let SystemExceptionFilter = class SystemExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error) {
        this.logger.error(error, error.stack, error_enum_1.ExceptionContextEnum.SYSTEM);
        return error;
    }
};
exports.SystemExceptionFilter = SystemExceptionFilter;
exports.SystemExceptionFilter = SystemExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)(TypeError, SyntaxError, RangeError, EvalError, ReferenceError),
    tslib_1.__metadata("design:paramtypes", [Object])
], SystemExceptionFilter);
//# sourceMappingURL=system-exception.filter.js.map