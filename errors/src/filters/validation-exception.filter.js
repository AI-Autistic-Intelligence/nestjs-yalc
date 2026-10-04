import { __decorate, __metadata } from "tslib";
import { CrudGenError } from '@nest-yalc-2/crud-gen/crud-gen.error.js';
import { UUIDValidationError } from '@nest-yalc-2/graphql/scalars/uuid-validation.error.js';
import * as common from '@nestjs/common';
import { InputValidationError } from '@node-yalc/errors';
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