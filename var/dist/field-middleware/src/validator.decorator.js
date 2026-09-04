import { registerDecorator } from 'class-validator';
import { StringFormatEnum } from './string-format.enum';
import { validateDate, validateStringFormat } from './validator.helper';
export const stringFormatMatchValidatorFactory = (stringMatchOptions) => {
    return {
        validate(string) {
            const result = validateStringFormat(string, stringMatchOptions.pattern);
            return stringMatchOptions.toMatch ? result : !result;
        },
    };
};
export const dateValidatorFactory = () => {
    return {
        validate(date) {
            return validateDate(date);
        },
    };
};
export function StringFormatMatchValidation(validationOptions, stringMatchOptions = {
    toMatch: true,
    pattern: StringFormatEnum.ALL,
}) {
    return function (object, propertyName) {
        registerDecorator({
            name: 'stringFormatMatchValidation',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: stringFormatMatchValidatorFactory(stringMatchOptions),
        });
    };
}
export function DateValidation(validationOptions = {}) {
    return function (object, propertyName) {
        registerDecorator({
            name: 'dateValidation',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: dateValidatorFactory(),
        });
    };
}
//# sourceMappingURL=validator.decorator.js.map