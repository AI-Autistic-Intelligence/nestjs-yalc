import { BadRequestException } from '@nestjs/common';
export var EntityErrorsEnum;
(function (EntityErrorsEnum) {
    EntityErrorsEnum["CREATION_FAILED"] = "Resource has not been created";
    EntityErrorsEnum["UPDATE_FAILED"] = "Resource has not been updated";
    EntityErrorsEnum["DELETE_FAILED"] = "Resource has not been deleted";
})(EntityErrorsEnum || (EntityErrorsEnum = {}));
export function isEntityNotFoundError(error) {
    return error.name === 'EntityNotFoundError';
}
export function isEntityError(error) {
    return (error.originalError !== undefined ||
        error instanceof EntityError);
}
export class EntityError extends BadRequestException {
    constructor(message, error) {
        super(message);
        this.stack = error?.stack;
        this.originalError = error;
    }
}
export class CreateEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.CREATION_FAILED, error);
    }
}
export class UpdateEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.UPDATE_FAILED, error);
    }
}
export class DeleteEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.DELETE_FAILED, error);
    }
}
//# sourceMappingURL=entity.error.js.map