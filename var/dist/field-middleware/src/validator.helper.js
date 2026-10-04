"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTrhow = errorTrhow;
exports.convertIfStringToDate = convertIfStringToDate;
exports.stringIsInEnumOrThrow = stringIsInEnumOrThrow;
exports.stringIsInEnum = stringIsInEnum;
exports.validateDate = validateDate;
exports.validateDateOrThrow = validateDateOrThrow;
exports.validateStringFormat = validateStringFormat;
const fields_error_enum_js_1 = require("./fields-error.enum.js");
function errorTrhow(value, message) {
    const err = message ? message : `${fields_error_enum_js_1.FieldErrorsEnum.INVALID_VALUE} ${value}`;
    throw new Error(err);
}
function convertIfStringToDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date;
}
function stringIsInEnumOrThrow(toCheck, enumName, message) {
    if (stringIsInEnum(toCheck, enumName)) {
        return true;
    }
    errorTrhow(toCheck, message);
}
function stringIsInEnum(toCheck, enumName) {
    for (const enumProperty of Object.values(enumName)) {
        if (`${enumProperty}`.toLowerCase() === toCheck.toLowerCase()) {
            return true;
        }
    }
    return false;
}
function validateDate(date) {
    date = convertIfStringToDate(date);
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (!isNaN(date.getTime())) {
            return true;
        }
    }
    return false;
}
function validateDateOrThrow(date, message) {
    if (validateDate(date)) {
        return true;
    }
    errorTrhow(date, message);
}
function validateStringFormat(str, stringFormat) {
    return str.match(stringFormat) !== null;
}
//# sourceMappingURL=validator.helper.js.map