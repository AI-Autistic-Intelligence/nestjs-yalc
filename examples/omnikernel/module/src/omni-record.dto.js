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
exports.OmniRecordUpdateInput = exports.OmniRecordCondition = exports.OmniRecordCreateInput = exports.OmniRecordType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
const omni_relation_dto_js_1 = require("./omni-relation.dto.js");
const omni_record_status_enum_js_1 = require("./omni-record-status.enum.js");
let OmniRecordType = class OmniRecordType extends omni_record_entity_js_1.OmniRecordEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniRecordType = OmniRecordType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniRecordType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OmniRecordType.prototype, "revision", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "externalId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], OmniRecordType.prototype, "title", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "slug", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], OmniRecordType.prototype, "kind", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_record_status_enum_js_1.OmniRecordStatus) }),
    (0, class_validator_1.IsEnum)(omni_record_status_enum_js_1.OmniRecordStatus),
    __metadata("design:type", String)
], OmniRecordType.prototype, "status", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payload", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], OmniRecordType.prototype, "payloadSchemaVersion", void 0);
__decorate([
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
    __metadata("design:type", Object)
], OmniRecordType.prototype, "outgoingRelations", void 0);
__decorate([
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
    __metadata("design:type", Object)
], OmniRecordType.prototype, "incomingRelations", void 0);
exports.OmniRecordType = OmniRecordType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], OmniRecordType);
let OmniRecordCreateInput = class OmniRecordCreateInput extends (0, graphql_1.OmitType)(OmniRecordType, [
    'createdAt',
    'updatedAt',
    'revision',
    'outgoingRelations',
    'incomingRelations',
], graphql_1.InputType) {
};
exports.OmniRecordCreateInput = OmniRecordCreateInput;
exports.OmniRecordCreateInput = OmniRecordCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniRecordCreateInput);
let OmniRecordCondition = class OmniRecordCondition extends (0, graphql_1.PartialType)(OmniRecordCreateInput, graphql_1.InputType) {
};
exports.OmniRecordCondition = OmniRecordCondition;
exports.OmniRecordCondition = OmniRecordCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniRecordType })
], OmniRecordCondition);
let OmniRecordUpdateInput = class OmniRecordUpdateInput extends (0, graphql_1.PartialType)(OmniRecordCreateInput, graphql_1.InputType) {
};
exports.OmniRecordUpdateInput = OmniRecordUpdateInput;
exports.OmniRecordUpdateInput = OmniRecordUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniRecordType })
], OmniRecordUpdateInput);
//# sourceMappingURL=omni-record.dto.js.map