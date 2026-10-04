import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsInt, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
import { OmniNamedEntity } from './base/omni-named.entity.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
let OmniNamedType = class OmniNamedType extends OmniNamedEntity {
    constructor(data) {
        super();
        if (data) {
            assignOmniPublicDto(this, data);
        }
    }
};
__decorate([
    ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true }),
    IsUUID(),
    __metadata("design:type", String)
], OmniNamedType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniNamedType.prototype, "revision", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniNamedType.prototype, "externalId", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], OmniNamedType.prototype, "title", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", Object)
], OmniNamedType.prototype, "slug", void 0);
OmniNamedType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniNamedType);
export { OmniNamedType };
let OmniNamedCreateInput = class OmniNamedCreateInput extends OmitType(OmniNamedType, ['createdAt', 'updatedAt', 'revision'], InputType) {
};
OmniNamedCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniNamedCreateInput);
export { OmniNamedCreateInput };
let OmniNamedCondition = class OmniNamedCondition extends PartialType(OmniNamedCreateInput, InputType) {
};
OmniNamedCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniNamedType })
], OmniNamedCondition);
export { OmniNamedCondition };
let OmniNamedUpdateInput = class OmniNamedUpdateInput extends PartialType(OmniNamedCreateInput, InputType) {
};
OmniNamedUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniNamedType })
], OmniNamedUpdateInput);
export { OmniNamedUpdateInput };
//# sourceMappingURL=omni-named.dto.js.map