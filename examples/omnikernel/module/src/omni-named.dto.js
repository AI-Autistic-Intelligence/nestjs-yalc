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
exports.OmniNamedUpdateInput = exports.OmniNamedCondition = exports.OmniNamedCreateInput = exports.OmniNamedType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nestjs-yalc/crud-gen/object.decorator.js");
const uuid_scalar_js_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const class_validator_1 = require("class-validator");
const omni_named_entity_js_1 = require("./base/omni-named.entity.js");
const omni_dto_helpers_js_1 = require("./omni-dto.helpers.js");
let OmniNamedType = class OmniNamedType extends omni_named_entity_js_1.OmniNamedEntity {
    constructor(data) {
        super();
        if (data) {
            (0, omni_dto_helpers_js_1.assignOmniPublicDto)(this, data);
        }
    }
};
exports.OmniNamedType = OmniNamedType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OmniNamedType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(graphql_1.Int) }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OmniNamedType.prototype, "revision", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], OmniNamedType.prototype, "externalId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(String) }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], OmniNamedType.prototype, "title", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(String),
        gqlOptions: { nullable: true },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], OmniNamedType.prototype, "slug", void 0);
exports.OmniNamedType = OmniNamedType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], OmniNamedType);
let OmniNamedCreateInput = class OmniNamedCreateInput extends (0, graphql_1.OmitType)(OmniNamedType, ['createdAt', 'updatedAt', 'revision'], graphql_1.InputType) {
};
exports.OmniNamedCreateInput = OmniNamedCreateInput;
exports.OmniNamedCreateInput = OmniNamedCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], OmniNamedCreateInput);
let OmniNamedCondition = class OmniNamedCondition extends (0, graphql_1.PartialType)(OmniNamedCreateInput, graphql_1.InputType) {
};
exports.OmniNamedCondition = OmniNamedCondition;
exports.OmniNamedCondition = OmniNamedCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniNamedType })
], OmniNamedCondition);
let OmniNamedUpdateInput = class OmniNamedUpdateInput extends (0, graphql_1.PartialType)(OmniNamedCreateInput, graphql_1.InputType) {
};
exports.OmniNamedUpdateInput = OmniNamedUpdateInput;
exports.OmniNamedUpdateInput = OmniNamedUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: OmniNamedType })
], OmniNamedUpdateInput);
//# sourceMappingURL=omni-named.dto.js.map