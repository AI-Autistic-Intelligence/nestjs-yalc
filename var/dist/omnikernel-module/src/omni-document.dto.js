import { __decorate, __metadata } from "tslib";
import { InputType, Int, ObjectType, OmitType, PartialType, } from '@nestjs/graphql';
import { ModelField, ModelObject, } from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { IsDate, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUrl, IsUUID, MaxLength, } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniDocumentEntity } from './omni-document.entity.js';
import { OmniDocumentKind } from './omni-document-kind.enum.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniRelationType } from './omni-relation.dto.js';
let OmniDocumentType = class OmniDocumentType extends OmniDocumentEntity {
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
], OmniDocumentType.prototype, "guid", void 0);
__decorate([
    ModelField({ gqlType: returnValue(Int) }),
    IsInt(),
    __metadata("design:type", Number)
], OmniDocumentType.prototype, "revision", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "externalId", void 0);
__decorate([
    ModelField({ gqlType: returnValue(String) }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], OmniDocumentType.prototype, "title", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "slug", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniDocumentKind) }),
    IsEnum(OmniDocumentKind),
    __metadata("design:type", String)
], OmniDocumentType.prototype, "kind", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniRecordStatus) }),
    IsEnum(OmniRecordStatus),
    __metadata("design:type", String)
], OmniDocumentType.prototype, "status", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "payload", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "payloadSchemaId", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Int),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "payloadSchemaVersion", void 0);
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
], OmniDocumentType.prototype, "outgoingRelations", void 0);
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
], OmniDocumentType.prototype, "incomingRelations", void 0);
__decorate([
    ModelField({ gqlType: returnValue(OmniDocumentKind) }),
    IsEnum(OmniDocumentKind),
    __metadata("design:type", String)
], OmniDocumentType.prototype, "documentKind", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "content", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsString(),
    MaxLength(128),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "contentMimeType", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(String),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsUrl(),
    MaxLength(2048),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "sourceUrl", void 0);
__decorate([
    ModelField({
        gqlType: returnValue(Date),
        gqlOptions: { nullable: true },
    }),
    IsOptional(),
    IsDate(),
    __metadata("design:type", Object)
], OmniDocumentType.prototype, "publishedAt", void 0);
OmniDocumentType = __decorate([
    ObjectType(),
    ModelObject(),
    __metadata("design:paramtypes", [Object])
], OmniDocumentType);
export { OmniDocumentType };
let OmniDocumentCreateInput = class OmniDocumentCreateInput extends OmitType(OmniDocumentType, [
    'createdAt',
    'updatedAt',
    'revision',
    'kind',
    'outgoingRelations',
    'incomingRelations',
], InputType) {
};
OmniDocumentCreateInput = __decorate([
    InputType(),
    ModelObject()
], OmniDocumentCreateInput);
export { OmniDocumentCreateInput };
let OmniDocumentCondition = class OmniDocumentCondition extends PartialType(OmniDocumentCreateInput, InputType) {
};
OmniDocumentCondition = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniDocumentType })
], OmniDocumentCondition);
export { OmniDocumentCondition };
let OmniDocumentUpdateInput = class OmniDocumentUpdateInput extends PartialType(OmniDocumentCreateInput, InputType) {
};
OmniDocumentUpdateInput = __decorate([
    InputType(),
    ModelObject({ copyFrom: OmniDocumentType })
], OmniDocumentUpdateInput);
export { OmniDocumentUpdateInput };
//# sourceMappingURL=omni-document.dto.js.map