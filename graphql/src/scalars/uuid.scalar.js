"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDScalar = void 0;
exports.formatValueErrorMessage = formatValueErrorMessage;
exports.formatKindErrorMessage = formatKindErrorMessage;
exports.validateUUID = validateUUID;
const tslib_1 = require("tslib");
const uuid_validation_error_js_1 = require("./uuid-validation.error.js");
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
let UUIDScalar = class UUIDScalar {
    constructor() {
        this.description = 'UUID Scalar Type';
    }
    parseValue(value) {
        if (!validateUUID(value))
            throw new uuid_validation_error_js_1.UUIDValidationError(formatValueErrorMessage(value));
        return value;
    }
    serialize(value) {
        return value;
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            const id = ast.value;
            return this.parseValue(id);
        }
        throw new uuid_validation_error_js_1.UUIDValidationError(formatKindErrorMessage(ast.kind));
    }
};
exports.UUIDScalar = UUIDScalar;
exports.UUIDScalar = UUIDScalar = tslib_1.__decorate([
    (0, graphql_1.Scalar)('UUID')
], UUIDScalar);
function formatValueErrorMessage(id) {
    return `"${id}" is not a valid UUID`;
}
function formatKindErrorMessage(kind) {
    return `A string were expected for the UUID Type, received ${kind}`;
}
function validateUUID(uuid) {
    const uuidCopy = [...uuid];
    const dashPosition = [23, 18, 13, 8];
    if (uuidCopy.length !== 36) {
        return false;
    }
    for (const i of dashPosition) {
        if (uuidCopy[i] !== '-') {
            return false;
        }
        delete uuidCopy[i];
    }
    for (const char of uuidCopy) {
        if (char === '-') {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=uuid.scalar.js.map