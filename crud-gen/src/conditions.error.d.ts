import { ConflictException, NotFoundException } from '@nestjs/common';
export declare class ConditionsTooBroadError extends ConflictException {
    constructor(conditions: any);
}
export declare class NoResultsFoundError extends NotFoundException {
    constructor(conditions: any);
}
