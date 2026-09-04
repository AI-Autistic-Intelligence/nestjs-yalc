import { __decorate, __metadata } from "tslib";
import { CrudGenError } from '@nestjs-yalc/crud-gen/crud-gen.error.js';
import { UUIDValidationError } from '@nestjs-yalc/graphql/scalars/uuid-validation.error.js';
import * as common from '@nestjs/common';
import { InputValidationError } from '../index.js';
let ValidationExceptionFilter = class ValidationExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error) {
        const newError = new InputValidationError(error.systemMessage, { response: { message: error.message } });
        newError.stack = error.stack;
        this.logger.error(error.systemMessage ?? newError.message, newError.stack);
        return newError;
    }
};
ValidationExceptionFilter = __decorate([
    common.Catch(UUIDValidationError, CrudGenError),
    __metadata("design:paramtypes", [Object])
], ValidationExceptionFilter);
export { ValidationExceptionFilter };
//# sourceMappingURL=validation-exception.filter.js.map