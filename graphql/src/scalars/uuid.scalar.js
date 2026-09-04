"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDScalar = void 0;
exports.formatValueErrorMessage = formatValueErrorMessage;
exports.formatKindErrorMessage = formatKindErrorMessage;
exports.validateUUID = validateUUID;
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
exports.UUIDScalar = UUIDScalar = __decorate([
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