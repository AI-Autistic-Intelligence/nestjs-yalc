"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniExternalRefUpdateInput = exports.OmniExternalRefCondition = exports.OmniExternalRefCreateInput = exports.OmniExternalRefType = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
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
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OmniExternalRefType.prototype, "guid", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], OmniExternalRefType.prototype, "revision", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType) }),
    (0, class_validator_1.IsEnum)(omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType),
    tslib_1.__metadata("design:type", String)
], OmniExternalRefType.prototype, "internalType", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OmniExternalRefType.prototype, "internalId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", String)
], OmniExternalRefType.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniExternalRefType.prototype, "account", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniExternalRefType.prototype, "container", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], OmniExternalRefType.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_type_json_1.GraphQLJSONObject),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], OmniExternalRefType.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    tslib_1.__metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaId", void 0);
tslib_1.__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(graphql_1.Int),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Object)
], OmniExternalRefType.prototype, "payloadSchemaVersion", void 0);
exports.OmniExternalRefType = OmniExternalRefType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], OmniExternalRefType);
let OmniExternalRefCreateInput = class OmniExternalRefCreateInput extends (0, graphql_1.OmitType)(OmniExternalRefType, ['createdAt', 'updatedAt', 'revision'], graphql_1.InputType) {
};
exports.OmniExternalRefCreateInput = OmniExternalRefCreateInput;
exports.OmniExternalRefCreateInput = OmniExternalRefCreateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniExternalRefCreateInput);
let OmniExternalRefCondition = class OmniExternalRefCondition extends (0, graphql_1.PartialType)(OmniExternalRefCreateInput, graphql_1.InputType) {
};
exports.OmniExternalRefCondition = OmniExternalRefCondition;
exports.OmniExternalRefCondition = OmniExternalRefCondition = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniExternalRefType })
], OmniExternalRefCondition);
let OmniExternalRefUpdateInput = class OmniExternalRefUpdateInput extends (0, graphql_1.PartialType)(OmniExternalRefCreateInput, graphql_1.InputType) {
};
exports.OmniExternalRefUpdateInput = OmniExternalRefUpdateInput;
exports.OmniExternalRefUpdateInput = OmniExternalRefUpdateInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniExternalRefType })
], OmniExternalRefUpdateInput);
//# sourceMappingURL=omni-external-ref.dto.js.map