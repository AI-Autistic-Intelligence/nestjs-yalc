"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoResultsFoundError = exports.ConditionsTooBroadError = void 0;
const common_1 = require("@nestjs/common");
class ConditionsTooBroadError extends common_1.ConflictException {
    constructor(conditions) {
        super({ conditions }, 'The provided conditions are too broad and affect multiple records.');
    }
}
exports.ConditionsTooBroadError = ConditionsTooBroadError;
class NoResultsFoundError extends common_1.NotFoundException {
    constructor(conditions) {
        super({ conditions }, 'No results found for the provided conditions.');
    }
}
exports.NoResultsFoundError = NoResultsFoundError;
//# sourceMappingURL=conditions.error.js.map