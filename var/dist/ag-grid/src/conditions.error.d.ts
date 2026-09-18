import { ConflictException, NotFoundException } from '@nestjs/common';
export declare class ConditionsTooBroadError extends ConflictException {
    constructor(conditions: unknown);
}
export declare class NoResultsFoundError extends NotFoundException {
    constructor(conditions: unknown);
}
