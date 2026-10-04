"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingArgumentsError = exports.ArgumentsError = void 0;
const common_1 = require("@nestjs/common");
const strings_enum_1 = require("./strings.enum");
class ArgumentsError extends common_1.BadRequestException {
    constructor(message) {
        super(message);
    }
}
exports.ArgumentsError = ArgumentsError;
class MissingArgumentsError extends ArgumentsError {
    constructor(message) {
        super(message ?? strings_enum_1.AgGridErrors.REQUIRED_ARGS);
    }
}
exports.MissingArgumentsError = MissingArgumentsError;
//# sourceMappingURL=missing-arguments.error.js.map