"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidatorFactory = exports.stringFormatMatchValidatorFactory = void 0;
exports.StringFormatMatchValidation = StringFormatMatchValidation;
exports.DateValidation = DateValidation;
const class_validator_1 = require("class-validator");
const string_format_enum_js_1 = require("./string-format.enum.js");
const validator_helper_js_1 = require("./validator.helper.js");
const stringFormatMatchValidatorFactory = (stringMatchOptions) => {
    return {
        validate(string) {
            const result = (0, validator_helper_js_1.validateStringFormat)(string, stringMatchOptions.pattern);
            return stringMatchOptions.toMatch ? result : !result;
        },
    };
};
exports.stringFormatMatchValidatorFactory = stringFormatMatchValidatorFactory;
const dateValidatorFactory = () => {
    return {
        validate(date) {
            return (0, validator_helper_js_1.validateDate)(date);
        },
    };
};
exports.dateValidatorFactory = dateValidatorFactory;
function StringFormatMatchValidation(validationOptions, stringMatchOptions = {
    toMatch: true,
    pattern: string_format_enum_js_1.StringFormatEnum.ALL,
}) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'stringFormatMatchValidation',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: (0, exports.stringFormatMatchValidatorFactory)(stringMatchOptions),
        });
    };
}
function DateValidation(validationOptions = {}) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'dateValidation',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: (0, exports.dateValidatorFactory)(),
        });
    };
}
//# sourceMappingURL=validator.decorator.js.map