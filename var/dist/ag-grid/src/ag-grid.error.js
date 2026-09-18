"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridFilterProhibited = exports.AgGridStringWhereError = exports.AgGridNotPossibleError = exports.AgGridBadFilterTypeError = exports.AgGridFilterNotSupportedError = exports.AgGridConditionNotSupportedError = exports.AgGridInvalidPropertyError = exports.AgGridInvalidOperatorError = exports.AgGridInvalidArgumentError = exports.AgGridError = void 0;
const gql_error_1 = require("@nest-yalc-2/graphql/plugins/gql.error");
const strings_enum_1 = require("./strings.enum");
class AgGridError extends gql_error_1.GqlError {
    constructor(message, systemMessage) {
        super(message, systemMessage);
        this.systemMessage = systemMessage;
    }
}
exports.AgGridError = AgGridError;
class AgGridInvalidArgumentError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.INVALID_ARGUMENT);
    }
}
exports.AgGridInvalidArgumentError = AgGridInvalidArgumentError;
class AgGridInvalidOperatorError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.INVALID_OPERATOR);
    }
}
exports.AgGridInvalidOperatorError = AgGridInvalidOperatorError;
class AgGridInvalidPropertyError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.INVALID_PROPERTY);
    }
}
exports.AgGridInvalidPropertyError = AgGridInvalidPropertyError;
class AgGridConditionNotSupportedError extends AgGridError {
    constructor(info) {
        super(strings_enum_1.FilterErrors.INVALID_CONDITION + (info ? `: ${info}` : ''));
    }
}
exports.AgGridConditionNotSupportedError = AgGridConditionNotSupportedError;
class AgGridFilterNotSupportedError extends AgGridError {
    constructor(info) {
        super(strings_enum_1.FilterErrors.FILTER_NOT_SUPPORTED + (info ? `: ${info}` : ''));
    }
}
exports.AgGridFilterNotSupportedError = AgGridFilterNotSupportedError;
class AgGridBadFilterTypeError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.BAD_FILTER_TYPE);
    }
}
exports.AgGridBadFilterTypeError = AgGridBadFilterTypeError;
class AgGridNotPossibleError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.NOT_POSSIBLE_EXCEPTION);
    }
}
exports.AgGridNotPossibleError = AgGridNotPossibleError;
class AgGridStringWhereError extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.STRING_WHERE);
    }
}
exports.AgGridStringWhereError = AgGridStringWhereError;
class AgGridFilterProhibited extends AgGridError {
    constructor() {
        super(strings_enum_1.FilterErrors.FILTER_PROHIBITED);
    }
}
exports.AgGridFilterProhibited = AgGridFilterProhibited;
//# sourceMappingURL=ag-grid.error.js.map