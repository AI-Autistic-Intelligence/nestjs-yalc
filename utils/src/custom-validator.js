"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsInEnumValidatorFactory = void 0;
const validator_helper_js_1 = require("./validator-helper.js");
const stringIsInEnumValidatorFactory = (property) => {
    return {
        validate(value) {
            return (0, validator_helper_js_1.stringIsInEnum)(value, property);
        },
    };
};
exports.stringIsInEnumValidatorFactory = stringIsInEnumValidatorFactory;
//# sourceMappingURL=custom-validator.js.map