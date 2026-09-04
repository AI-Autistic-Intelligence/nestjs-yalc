import { BadRequestException } from '@nestjs/common';
import { CrudGenErrors } from './strings.enum.js';
export class ArgumentsError extends BadRequestException {
    constructor(message) {
        super(message);
    }
}
export class MissingArgumentsError extends ArgumentsError {
    constructor(message) {
        super(message ?? CrudGenErrors.REQUIRED_ARGS);
    }
}
//# sourceMappingURL=missing-arguments.error.js.map