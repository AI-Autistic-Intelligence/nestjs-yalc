import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, Matches, } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniRecordType } from './omni-record.dto.js';
import { omniRelationKindPattern } from './omni-relation-kind.contract.js';
import { OmniRelationStatus } from './omni-relation-status.enum.js';
let OmniRelationType = class OmniRelationType extends OmniRelationEntity {
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
], OmniRelationType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniRelationType.prototype, "revision", void 0);
__decorate([
    ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true }),
    IsUUID(),
    __metadata("design:type", String)
], OmniRelationType.prototype, "sourceRecordId", void 0);
__decorate([
    ModelField({
        gqlType: () => OmniRecordType,
        gqlOptions: { nullable: false },
        relation: {
            relationType: 'many-to-one',
            sourceKey: { dst: 'sourceRecordId', alias: 'sourceRecordId' },
            targetKey: { dst: 'guid', alias: 'guid' },
            type: () => OmniRecordEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "sourceRecord", void 0);
__decorate([
    ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true }),
    IsUUID(),
    __metadata("design:type", String)
], OmniRelationType.prototype, "targetRecordId", void 0);
__decorate([
    ModelField({
        gqlType: () => OmniRecordType,
        gqlOptions: { nullable: false },
        relation: {
            relationType: 'many-to-one',
            sourceKey: { dst: 'targetRecordId', alias: 'targetRecordId' },
            targetKey: { dst: 'guid', alias: 'guid' },
            type: () => OmniRecordEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "targetRecord", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    Matches(omniRelationKindPattern),
    __metadata("design:type", String)
], OmniRelationType.prototype, "kind", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniRelationStatus) }),
    IsEnum(OmniRelationStatus),
    __metadata("design:type", String)
], OmniRelationType.prototype, "status", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payload", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payloadSchemaId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Int),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payloadSchemaVersion", void 0);
OmniRelationType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniRelationType);
export { OmniRelationType };
let OmniRelationCreateInput = class OmniRelationCreateInput extends OmitType(OmniRelationType, [
    'createdAt',
    'updatedAt',
    'revision',
    'sourceRecord',
    'targetRecord',
], InputType) {
};
OmniRelationCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniRelationCreateInput);
export { OmniRelationCreateInput };
let OmniRelationCondition = class OmniRelationCondition extends PartialType(OmniRelationCreateInput, InputType) {
};
OmniRelationCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniRelationType })
], OmniRelationCondition);
export { OmniRelationCondition };
let OmniRelationUpdateInput = class OmniRelationUpdateInput extends PartialType(OmniRelationCreateInput, InputType) {
};
OmniRelationUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniRelationType })
], OmniRelationUpdateInput);
export { OmniRelationUpdateInput };
//# sourceMappingURL=omni-relation.dto.js.map