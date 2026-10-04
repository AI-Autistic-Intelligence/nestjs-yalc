import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniRelationType } from './omni-relation.dto.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
let OmniRecordType = class OmniRecordType extends OmniRecordEntity {
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
], OmniRecordType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniRecordType.prototype, "revision", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "externalId", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], OmniRecordType.prototype, "title", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "slug", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(64),
    __metadata("design:type", String)
], OmniRecordType.prototype, "kind", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniRecordStatus) }),
    IsEnum(OmniRecordStatus),
    __metadata("design:type", String)
], OmniRecordType.prototype, "status", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payload", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payloadSchemaId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Int),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payloadSchemaVersion", void 0);
__decorate([
    ModelField({
        gqlType: () => [OmniRelationType],
        gqlOptions: { nullable: true },
        relation: {
            relationType: 'one-to-many',
            sourceKey: { dst: 'guid', alias: 'guid' },
            targetKey: { dst: 'sourceRecordId', alias: 'sourceRecordId' },
            type: () => OmniRelationEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "outgoingRelations", void 0);
__decorate([
    ModelField({
        gqlType: () => [OmniRelationType],
        gqlOptions: { nullable: true },
        relation: {
            relationType: 'one-to-many',
            sourceKey: { dst: 'guid', alias: 'guid' },
            targetKey: { dst: 'targetRecordId', alias: 'targetRecordId' },
            type: () => OmniRelationEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "incomingRelations", void 0);
OmniRecordType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniRecordType);
export { OmniRecordType };
let OmniRecordCreateInput = class OmniRecordCreateInput extends OmitType(OmniRecordType, [
    'createdAt',
    'updatedAt',
    'revision',
    'outgoingRelations',
    'incomingRelations',
], InputType) {
};
OmniRecordCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniRecordCreateInput);
export { OmniRecordCreateInput };
let OmniRecordCondition = class OmniRecordCondition extends PartialType(OmniRecordCreateInput, InputType) {
};
OmniRecordCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniRecordType })
], OmniRecordCondition);
export { OmniRecordCondition };
let OmniRecordUpdateInput = class OmniRecordUpdateInput extends PartialType(OmniRecordCreateInput, InputType) {
};
OmniRecordUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniRecordType })
], OmniRecordUpdateInput);
export { OmniRecordUpdateInput };
//# sourceMappingURL=omni-record.dto.js.map