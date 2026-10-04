import { BadRequestException } from '@nestjs/common';
export declare enum EntityErrorsEnum {
    CREATION_FAILED = "Resource has not been created",
    UPDATE_FAILED = "Resource has not been updated",
    DELETE_FAILED = "Resource has not been deleted"
}
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
