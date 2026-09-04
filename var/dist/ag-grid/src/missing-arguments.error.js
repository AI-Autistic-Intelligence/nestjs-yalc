import { BadRequestException } from '@nestjs/common';
import { AgGridErrors } from './strings.enum';
export class ArgumentsError extends BadRequestException {
    constructor(message) {
        super(message);
    }
}
export class MissingArgumentsError extends ArgumentsError {
    constructor(message) {
        super(message ?? AgGridErrors.REQUIRED_ARGS);
    }
}
//# sourceMappingURL=missing-arguments.error.js.map