"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsInEnumOrThrow = stringIsInEnumOrThrow;
exports.stringIsInEnum = stringIsInEnum;
const errors_1 = require("@nest-yalc-2/errors");
function stringIsInEnumOrThrow(toCheck, enumName, message) {
    if (stringIsInEnum(toCheck, enumName)) {
        return true;
    }
    const err = message ? message : `${errors_1.ErrorsEnum.INVALID_VALUE} ${toCheck}`;
    throw new Error(err);
}
function stringIsInEnum(toCheck, enumName) {
    for (const enumProperty of Object.values(enumName)) {
        if (typeof enumProperty === 'string' &&
            enumProperty.toLowerCase() === toCheck.toLowerCase()) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=validator-helper.js.map