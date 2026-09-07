"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationUpdateInput = exports.OmniRelationCondition = exports.OmniRelationCreateInput = exports.OmniRelationType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
const omni_record_dto_js_1 = require("./omni-record.dto.js");
const omni_relation_kind_contract_js_1 = require("./omni-relation-kind.contract.js");
const omni_relation_status_enum_js_1 = require("./omni-relation-status.enum.js");
let OmniRelationType = class OmniRelationType extends omni_relation_entity_js_1.OmniRelationEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniRelationType = OmniRelationType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniRelationType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OmniRelationType.prototype, "revision", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniRelationType.prototype, "sourceRecordId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: () => omni_record_dto_js_1.OmniRecordType,
        gqlOptions: { nullable: false },
        relation: {
            relationType: 'many-to-one',
            sourceKey: { dst: 'sourceRecordId', alias: 'sourceRecordId' },
            targetKey: { dst: 'guid', alias: 'guid' },
            type: () => omni_record_entity_js_1.OmniRecordEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "sourceRecord", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniRelationType.prototype, "targetRecordId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: () => omni_record_dto_js_1.OmniRecordType,
        gqlOptions: { nullable: false },
        relation: {
            relationType: 'many-to-one',
            sourceKey: { dst: 'targetRecordId', alias: 'targetRecordId' },
            targetKey: { dst: 'guid', alias: 'guid' },
            type: () => omni_record_entity_js_1.OmniRecordEntity,
        },
    }),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "targetRecord", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(omni_relation_kind_contract_js_1.omniRelationKindPattern),
    __metadata("design:type", String)
], OmniRelationType.prototype, "kind", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_relation_status_enum_js_1.OmniRelationStatus) }),
    (0, class_validator_1.IsEnum)(omni_relation_status_enum_js_1.OmniRelationStatus),
    __metadata("design:type", String)
], OmniRelationType.prototype, "status", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payload", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], OmniRelationType.prototype, "payloadSchemaVersion", void 0);
exports.OmniRelationType = OmniRelationType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], OmniRelationType);
let OmniRelationCreateInput = class OmniRelationCreateInput extends (0, graphql_1.OmitType)(OmniRelationType, [
    'createdAt',
    'updatedAt',
    'revision',
    'sourceRecord',
    'targetRecord',
], graphql_1.InputType) {
};
exports.OmniRelationCreateInput = OmniRelationCreateInput;
exports.OmniRelationCreateInput = OmniRelationCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniRelationCreateInput);
let OmniRelationCondition = class OmniRelationCondition extends (0, graphql_1.PartialType)(OmniRelationCreateInput, graphql_1.InputType) {
};
exports.OmniRelationCondition = OmniRelationCondition;
exports.OmniRelationCondition = OmniRelationCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniRelationType })
], OmniRelationCondition);
let OmniRelationUpdateInput = class OmniRelationUpdateInput extends (0, graphql_1.PartialType)(OmniRelationCreateInput, graphql_1.InputType) {
};
exports.OmniRelationUpdateInput = OmniRelationUpdateInput;
exports.OmniRelationUpdateInput = OmniRelationUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniRelationType })
], OmniRelationUpdateInput);
//# sourceMappingURL=omni-relation.dto.js.map