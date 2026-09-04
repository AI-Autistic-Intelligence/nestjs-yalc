import { FieldErrorsEnum } from './field-error.enum';
export function errorTrhow(value, message) {
    const err = message ? message : `${FieldErrorsEnum.INVALID_VALUE} ${value}`;
    throw new Error(err);
}
export function convertIfStringToDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date;
}
export function stringIsInEnumOrThrow(toCheck, enumName, message) {
    if (stringIsInEnum(toCheck, enumName)) {
        return true;
    }
    errorTrhow(toCheck, message);
}
export function stringIsInEnum(toCheck, enumName) {
    for (const enumProperty of Object.values(enumName)) {
        if (enumProperty.toLowerCase() === toCheck.toLowerCase()) {
            return true;
        }
    }
    return false;
}
export function validateDate(date) {
    date = convertIfStringToDate(date);
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (!isNaN(date.getTime())) {
            return true;
        }
    }
    return false;
}
export function validateDateOrThrow(date, message) {
    if (validateDate(date)) {
        return true;
    }
    errorTrhow(date, message);
}
export function validateStringFormat(str, stringFormat) {
    return str.match(stringFormat) !== null;
}
//# sourceMappingURL=validator.helper.js.map