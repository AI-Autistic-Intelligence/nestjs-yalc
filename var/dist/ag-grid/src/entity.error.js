"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEntityError = exports.UpdateEntityError = exports.CreateEntityError = exports.EntityError = exports.EntityErrorsEnum = void 0;
const common_1 = require("@nestjs/common");
var EntityErrorsEnum;
(function (EntityErrorsEnum) {
    EntityErrorsEnum["CREATION_FAILED"] = "Resource has not been created";
    EntityErrorsEnum["UPDATE_FAILED"] = "Resource has not been updated";
    EntityErrorsEnum["DELETE_FAILED"] = "Resource has not been deleted";
})(EntityErrorsEnum || (exports.EntityErrorsEnum = EntityErrorsEnum = {}));
class EntityError extends common_1.BadRequestException {
    constructor(message, error) {
        super(message);
        this.stack = error?.stack;
        this.originalError = error;
    }
}
exports.EntityError = EntityError;
class CreateEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.CREATION_FAILED, error);
    }
}
exports.CreateEntityError = CreateEntityError;
class UpdateEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.UPDATE_FAILED, error);
    }
}
exports.UpdateEntityError = UpdateEntityError;
class DeleteEntityError extends EntityError {
    constructor(error) {
        super(EntityErrorsEnum.DELETE_FAILED, error);
    }
}
exports.DeleteEntityError = DeleteEntityError;
//# sourceMappingURL=entity.error.js.map