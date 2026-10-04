import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
let OmniExternalRefType = class OmniExternalRefType extends OmniExternalRefEntity {
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
], OmniExternalRefType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniExternalRefType.prototype, "revision", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniExternalRefInternalType) }),
    IsEnum(OmniExternalRefInternalType),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "internalType", void 0);
__decorate([
    ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true }),
    IsUUID(),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "internalId", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(128),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "provider", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "account", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "container", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "externalId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payload", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Int),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaVersion", void 0);
OmniExternalRefType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniExternalRefType);
export { OmniExternalRefType };
let OmniExternalRefCreateInput = class OmniExternalRefCreateInput extends OmitType(OmniExternalRefType, ['createdAt', 'updatedAt', 'revision'], InputType) {
};
OmniExternalRefCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniExternalRefCreateInput);
export { OmniExternalRefCreateInput };
let OmniExternalRefCondition = class OmniExternalRefCondition extends PartialType(OmniExternalRefCreateInput, InputType) {
};
OmniExternalRefCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniExternalRefType })
], OmniExternalRefCondition);
export { OmniExternalRefCondition };
let OmniExternalRefUpdateInput = class OmniExternalRefUpdateInput extends PartialType(OmniExternalRefCreateInput, InputType) {
};
OmniExternalRefUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniExternalRefType })
], OmniExternalRefUpdateInput);
export { OmniExternalRefUpdateInput };
//# sourceMappingURL=omni-external-ref.dto.js.map