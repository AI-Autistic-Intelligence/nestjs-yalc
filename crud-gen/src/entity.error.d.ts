import { BadRequestException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
export declare enum EntityErrorsEnum {
    CREATION_FAILED = "Resource has not been created",
    UPDATE_FAILED = "Resource has not been updated",
    DELETE_FAILED = "Resource has not been deleted"
}
export declare function isEntityNotFoundError(error: any): error is EntityNotFoundError;
export declare function isEntityError(error: any): error is EntityError;
export declare class EntityError extends BadRequestException {
    originalError: Error | undefined;
    constructor(message: string, error?: Error);
}
export declare class CreateEntityError extends EntityError {
    constructor(error?: Error);
}
export declare class UpdateEntityError extends EntityError {
    constructor(error?: Error);
}
export declare class DeleteEntityError extends EntityError {
    constructor(error?: Error);
}
