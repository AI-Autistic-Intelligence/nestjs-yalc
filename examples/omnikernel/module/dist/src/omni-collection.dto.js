"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniCollectionUpdateInput = exports.OmniCollectionCondition = exports.OmniCollectionCreateInput = exports.OmniCollectionType = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_collection_entity_js_1 = require("./omni-collection.entity.js");
const omni_collection_kind_enum_js_1 = require("./omni-collection-kind.enum.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
const omni_record_status_enum_js_1 = require("./omni-record-status.enum.js");
const omni_relation_dto_js_1 = require("./omni-relation.dto.js");
let OmniCollectionType = class OmniCollectionType extends omni_collection_entity_js_1.OmniCollectionEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniCollectionType = OmniCollectionType;
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OmniCollectionType.prototype, "guid", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], OmniCollectionType.prototype, "revision", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], OmniCollectionType.prototype, "title", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_collection_kind_enum_js_1.OmniCollectionKind) }),
    (0, class_validator_1.IsEnum)(omni_collection_kind_enum_js_1.OmniCollectionKind),
    tslib_1.__metadata("design:type", String)
], OmniCollectionType.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_record_status_enum_js_1.OmniRecordStatus) }),
    (0, class_validator_1.IsEnum)(omni_record_status_enum_js_1.OmniRecordStatus),
    tslib_1.__metadata("design:type", String)
], OmniCollectionType.prototype, "status", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "payloadSchemaId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "payloadSchemaVersion", void 0);
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
], OmniCollectionType.prototype, "outgoingRelations", void 0);
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
], OmniCollectionType.prototype, "incomingRelations", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_collection_kind_enum_js_1.OmniCollectionKind) }),
    (0, class_validator_1.IsEnum)(omni_collection_kind_enum_js_1.OmniCollectionKind),
    tslib_1.__metadata("design:type", String)
], OmniCollectionType.prototype, "collectionKind", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionType.prototype, "summary", void 0);
exports.OmniCollectionType = OmniCollectionType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], OmniCollectionType);
let OmniCollectionCreateInput = class OmniCollectionCreateInput extends (0, graphql_1.OmitType)(OmniCollectionType, [
    'createdAt',
    'updatedAt',
    'revision',
    'kind',
    'outgoingRelations',
    'incomingRelations',
], graphql_1.InputType) {
};
exports.OmniCollectionCreateInput = OmniCollectionCreateInput;
exports.OmniCollectionCreateInput = OmniCollectionCreateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniCollectionCreateInput);
let OmniCollectionCondition = class OmniCollectionCondition extends (0, graphql_1.PartialType)(OmniCollectionCreateInput, graphql_1.InputType) {
};
exports.OmniCollectionCondition = OmniCollectionCondition;
exports.OmniCollectionCondition = OmniCollectionCondition = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniCollectionType })
], OmniCollectionCondition);
let OmniCollectionUpdateInput = class OmniCollectionUpdateInput extends (0, graphql_1.PartialType)(OmniCollectionCreateInput, graphql_1.InputType) {
};
exports.OmniCollectionUpdateInput = OmniCollectionUpdateInput;
exports.OmniCollectionUpdateInput = OmniCollectionUpdateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniCollectionType })
], OmniCollectionUpdateInput);
//# sourceMappingURL=omni-collection.dto.js.map