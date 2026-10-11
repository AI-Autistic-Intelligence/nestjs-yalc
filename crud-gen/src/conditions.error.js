import { ConflictException, NotFoundException } from '@nestjs/common';
// nothing to cover on simple class
export class ConditionsTooBroadError extends ConflictException {
    constructor(conditions) {
        super({ conditions }, 'The provided conditions are too broad and affect multiple records.');
    }
}
// nothing to cover on simple class
export class NoResultsFoundError extends NotFoundException {
    constructor(conditions) {
        super({ conditions }, 'No results found for the provided conditions.');
    }
}
//# sourceMappingURL=conditions.error.js.map