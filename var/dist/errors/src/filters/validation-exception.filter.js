"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const tslib_1 = require("tslib");
const crud_gen_error_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.error.js");
const uuid_validation_error_js_1 = require("@nest-yalc-2/graphql/scalars/uuid-validation.error.js");
const common = tslib_1.__importStar(require("@nestjs/common"));
const index_js_1 = require("../index.js");
let ValidationExceptionFilter = class ValidationExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error) {
        const newError = new index_js_1.InputValidationError(error.systemMessage, { response: { message: error.message } });
        newError.stack = error.stack;
        this.logger.error(error.systemMessage ?? newError.message, newError.stack);
        return newError;
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = tslib_1.__decorate([
    common.Catch(uuid_validation_error_js_1.UUIDValidationError, crud_gen_error_js_1.CrudGenError),
    tslib_1.__metadata("design:paramtypes", [Object])
], ValidationExceptionFilter);
//# sourceMappingURL=validation-exception.filter.js.map