"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudGenFilterProhibited = exports.CrudGenStringWhereError = exports.CrudGenNotPossibleError = exports.CrudGenBadFilterTypeError = exports.CrudGenFilterNotSupportedError = exports.CrudGenConditionNotSupportedError = exports.CrudGenInvalidPropertyError = exports.CrudGenInvalidOperatorError = exports.CrudGenInvalidArgumentError = exports.CrudGenError = void 0;
const gql_error_js_1 = require("@nest-yalc-2/graphql/plugins/gql.error.js");
const strings_enum_js_1 = require("./strings.enum.js");
class CrudGenError extends gql_error_js_1.GqlError {
    constructor(message, systemMessage) {
        super(message, systemMessage);
        this.systemMessage = systemMessage;
    }
}
exports.CrudGenError = CrudGenError;
class CrudGenInvalidArgumentError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.INVALID_ARGUMENT);
    }
}
exports.CrudGenInvalidArgumentError = CrudGenInvalidArgumentError;
class CrudGenInvalidOperatorError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.INVALID_OPERATOR);
    }
}
exports.CrudGenInvalidOperatorError = CrudGenInvalidOperatorError;
class CrudGenInvalidPropertyError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.INVALID_PROPERTY);
    }
}
exports.CrudGenInvalidPropertyError = CrudGenInvalidPropertyError;
class CrudGenConditionNotSupportedError extends CrudGenError {
    constructor(info) {
        super(strings_enum_js_1.FilterErrors.INVALID_CONDITION + (info ? `: ${info}` : ''));
    }
}
exports.CrudGenConditionNotSupportedError = CrudGenConditionNotSupportedError;
class CrudGenFilterNotSupportedError extends CrudGenError {
    constructor(info) {
        super(strings_enum_js_1.FilterErrors.FILTER_NOT_SUPPORTED + (info ? `: ${info}` : ''));
    }
}
exports.CrudGenFilterNotSupportedError = CrudGenFilterNotSupportedError;
class CrudGenBadFilterTypeError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.BAD_FILTER_TYPE);
    }
}
exports.CrudGenBadFilterTypeError = CrudGenBadFilterTypeError;
class CrudGenNotPossibleError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.NOT_POSSIBLE_EXCEPTION);
    }
}
exports.CrudGenNotPossibleError = CrudGenNotPossibleError;
class CrudGenStringWhereError extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.STRING_WHERE);
    }
}
exports.CrudGenStringWhereError = CrudGenStringWhereError;
class CrudGenFilterProhibited extends CrudGenError {
    constructor() {
        super(strings_enum_js_1.FilterErrors.FILTER_PROHIBITED);
    }
}
exports.CrudGenFilterProhibited = CrudGenFilterProhibited;
//# sourceMappingURL=crud-gen.error.js.map