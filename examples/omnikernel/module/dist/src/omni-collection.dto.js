import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import { OmniCollectionKind } from './omni-collection-kind.enum.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
import { OmniRelationType } from './omni-relation.dto.js';
let OmniCollectionType = class OmniCollectionType extends OmniCollectionEntity {
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
], OmniCollectionType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniCollectionType.prototype, "revision", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "externalId", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], OmniCollectionType.prototype, "title", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "slug", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniCollectionKind) }),
    IsEnum(OmniCollectionKind),
    __metadata("design:type", String)
], OmniCollectionType.prototype, "kind", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniRecordStatus) }),
    IsEnum(OmniRecordStatus),
    __metadata("design:type", String)
], OmniCollectionType.prototype, "status", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "payload", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "payloadSchemaId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Int),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "payloadSchemaVersion", void 0);
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
], OmniCollectionType.prototype, "outgoingRelations", void 0);
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
], OmniCollectionType.prototype, "incomingRelations", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniCollectionKind) }),
    IsEnum(OmniCollectionKind),
    __metadata("design:type", String)
], OmniCollectionType.prototype, "collectionKind", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", Object)
], OmniCollectionType.prototype, "summary", void 0);
OmniCollectionType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniCollectionType);
export { OmniCollectionType };
let OmniCollectionCreateInput = class OmniCollectionCreateInput extends OmitType(OmniCollectionType, [
    'createdAt',
    'updatedAt',
    'revision',
    'kind',
    'outgoingRelations',
    'incomingRelations',
], InputType) {
};
OmniCollectionCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniCollectionCreateInput);
export { OmniCollectionCreateInput };
let OmniCollectionCondition = class OmniCollectionCondition extends PartialType(OmniCollectionCreateInput, InputType) {
};
OmniCollectionCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniCollectionType })
], OmniCollectionCondition);
export { OmniCollectionCondition };
let OmniCollectionUpdateInput = class OmniCollectionUpdateInput extends PartialType(OmniCollectionCreateInput, InputType) {
};
OmniCollectionUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniCollectionType })
], OmniCollectionUpdateInput);
export { OmniCollectionUpdateInput };
//# sourceMappingURL=omni-collection.dto.js.map