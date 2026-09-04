import { __decorate } from "tslib";
import { UUIDValidationError } from './uuid-validation.error';
import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';
let UUIDScalar = class UUIDScalar {
    constructor() {
        this.description = 'UUID Scalar Type';
    }
    parseValue(value) {
        if (!validateUUID(value))
            throw new UUIDValidationError(formatValueErrorMessage(value));
        return value;
    }
    serialize(value) {
        return value;
    }
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const id = ast.value;
            return this.parseValue(id);
        }
        throw new UUIDValidationError(formatKindErrorMessage(ast.kind));
    }
};
UUIDScalar = __decorate([
    Scalar('UUID')
], UUIDScalar);
export { UUIDScalar };
export function formatValueErrorMessage(id) {
    return `"${id}" is not a valid UUID`;
}
export function formatKindErrorMessage(kind) {
    return `A string were expected for the UUID Type, received ${kind}`;
}
export function validateUUID(uuid) {
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