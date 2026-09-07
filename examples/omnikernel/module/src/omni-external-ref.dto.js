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
exports.OmniExternalRefUpdateInput = exports.OmniExternalRefCondition = exports.OmniExternalRefCreateInput = exports.OmniExternalRefType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const omni_external_ref_entity_js_1 = require("./base/omni-external-ref.entity.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
const omni_external_ref_internal_type_enum_js_1 = require("./omni-external-ref-internal-type.enum.js");
let OmniExternalRefType = class OmniExternalRefType extends omni_external_ref_entity_js_1.OmniExternalRefEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniExternalRefType = OmniExternalRefType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OmniExternalRefType.prototype, "revision", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType) }),
    (0, class_validator_1.IsEnum)(omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "internalType", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "internalId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "provider", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "account", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "container", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], OmniExternalRefType.prototype, "externalId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payload", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaVersion", void 0);
exports.OmniExternalRefType = OmniExternalRefType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], OmniExternalRefType);
let OmniExternalRefCreateInput = class OmniExternalRefCreateInput extends (0, graphql_1.OmitType)(OmniExternalRefType, ['createdAt', 'updatedAt', 'revision'], graphql_1.InputType) {
};
exports.OmniExternalRefCreateInput = OmniExternalRefCreateInput;
exports.OmniExternalRefCreateInput = OmniExternalRefCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniExternalRefCreateInput);
let OmniExternalRefCondition = class OmniExternalRefCondition extends (0, graphql_1.PartialType)(OmniExternalRefCreateInput, graphql_1.InputType) {
};
exports.OmniExternalRefCondition = OmniExternalRefCondition;
exports.OmniExternalRefCondition = OmniExternalRefCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniExternalRefType })
], OmniExternalRefCondition);
let OmniExternalRefUpdateInput = class OmniExternalRefUpdateInput extends (0, graphql_1.PartialType)(OmniExternalRefCreateInput, graphql_1.InputType) {
};
exports.OmniExternalRefUpdateInput = OmniExternalRefUpdateInput;
exports.OmniExternalRefUpdateInput = OmniExternalRefUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniExternalRefType })
], OmniExternalRefUpdateInput);
//# sourceMappingURL=omni-external-ref.dto.js.map