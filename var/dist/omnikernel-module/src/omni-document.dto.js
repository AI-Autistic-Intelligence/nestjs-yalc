"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniDocumentUpdateInput = exports.OmniDocumentCondition = exports.OmniDocumentCreateInput = exports.OmniDocumentType = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const omni_document_entity_js_1 = require("./omni-document.entity.js");
const omni_document_kind_enum_js_1 = require("./omni-document-kind.enum.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
const omni_record_status_enum_js_1 = require("./omni-record-status.enum.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_relation_dto_js_1 = require("./omni-relation.dto.js");
let OmniDocumentType = class OmniDocumentType extends omni_document_entity_js_1.OmniDocumentEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniDocumentType = OmniDocumentType;
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OmniDocumentType.prototype, "guid", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], OmniDocumentType.prototype, "revision", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], OmniDocumentType.prototype, "title", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_document_kind_enum_js_1.OmniDocumentKind) }),
    (0, class_validator_1.IsEnum)(omni_document_kind_enum_js_1.OmniDocumentKind),
    tslib_1.__metadata("design:type", String)
], OmniDocumentType.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_record_status_enum_js_1.OmniRecordStatus) }),
    (0, class_validator_1.IsEnum)(omni_record_status_enum_js_1.OmniRecordStatus),
    tslib_1.__metadata("design:type", String)
], OmniDocumentType.prototype, "status", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "payloadSchemaId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "payloadSchemaVersion", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: () => [omni_relation_dto_js_1.OmniRelationType],
        gqlOptions: { nullable: true },
        relation: {
            relationType: 'one-to-many',
            sourceKey: { dst: 'guid', alias: 'guid' },
            targetKey: { dst: 'sourceRecordId', alias: 'sourceRecordId' },
            type: () => omni_relation_entity_js_1.OmniRelationEntity,
        },
    }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "outgoingRelations", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: () => [omni_relation_dto_js_1.OmniRelationType],
        gqlOptions: { nullable: true },
        relation: {
            relationType: 'one-to-many',
            sourceKey: { dst: 'guid', alias: 'guid' },
            targetKey: { dst: 'targetRecordId', alias: 'targetRecordId' },
            type: () => omni_relation_entity_js_1.OmniRelationEntity,
        },
    }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "incomingRelations", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_document_kind_enum_js_1.OmniDocumentKind) }),
    (0, class_validator_1.IsEnum)(omni_document_kind_enum_js_1.OmniDocumentKind),
    tslib_1.__metadata("design:type", String)
], OmniDocumentType.prototype, "documentKind", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "content", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "contentMimeType", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MaxLength)(2048),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "sourceUrl", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(Date),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentType.prototype, "publishedAt", void 0);
exports.OmniDocumentType = OmniDocumentType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], OmniDocumentType);
let OmniDocumentCreateInput = class OmniDocumentCreateInput extends (0, graphql_1.OmitType)(OmniDocumentType, [
    'createdAt',
    'updatedAt',
    'revision',
    'kind',
    'outgoingRelations',
    'incomingRelations',
], graphql_1.InputType) {
};
exports.OmniDocumentCreateInput = OmniDocumentCreateInput;
exports.OmniDocumentCreateInput = OmniDocumentCreateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniDocumentCreateInput);
let OmniDocumentCondition = class OmniDocumentCondition extends (0, graphql_1.PartialType)(OmniDocumentCreateInput, graphql_1.InputType) {
};
exports.OmniDocumentCondition = OmniDocumentCondition;
exports.OmniDocumentCondition = OmniDocumentCondition = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniDocumentType })
], OmniDocumentCondition);
let OmniDocumentUpdateInput = class OmniDocumentUpdateInput extends (0, graphql_1.PartialType)(OmniDocumentCreateInput, graphql_1.InputType) {
};
exports.OmniDocumentUpdateInput = OmniDocumentUpdateInput;
exports.OmniDocumentUpdateInput = OmniDocumentUpdateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniDocumentType })
], OmniDocumentUpdateInput);
//# sourceMappingURL=omni-document.dto.js.map