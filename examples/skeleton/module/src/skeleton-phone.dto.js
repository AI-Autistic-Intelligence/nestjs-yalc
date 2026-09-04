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
exports.SkeletonPhoneUpdateInput = exports.SkeletonPhoneCondition = exports.SkeletonPhoneCreateInput = exports.SkeletonPhoneType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nestjs-yalc/crud-gen/object.decorator.js");
const skeleton_phone_entity_js_1 = require("./skeleton-phone.entity.js");
const uuid_scalar_js_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const skeleton_user_dto_js_1 = require("./skeleton-user.dto.js");
let SkeletonPhoneType = class SkeletonPhoneType extends skeleton_phone_entity_js_1.SkeletonPhone {
    constructor(data) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
};
exports.SkeletonPhoneType = SkeletonPhoneType;
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: 'The phone record ID',
        },
    }),
    __metadata("design:type", Number)
], SkeletonPhoneType.prototype, "ID", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: 'The phone number',
        },
    }),
    __metadata("design:type", String)
], SkeletonPhoneType.prototype, "phoneNumber", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: () => skeleton_user_dto_js_1.SkeletonUserType,
    }),
    __metadata("design:type", skeleton_user_dto_js_1.SkeletonUserType)
], SkeletonPhoneType.prototype, "SkeletonUser", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar) }),
    __metadata("design:type", String)
], SkeletonPhoneType.prototype, "userId", void 0);
exports.SkeletonPhoneType = SkeletonPhoneType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], SkeletonPhoneType);
let SkeletonPhoneCreateInput = class SkeletonPhoneCreateInput extends (0, graphql_1.OmitType)(SkeletonPhoneType, ['SkeletonUser'], graphql_1.InputType) {
};
exports.SkeletonPhoneCreateInput = SkeletonPhoneCreateInput;
exports.SkeletonPhoneCreateInput = SkeletonPhoneCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], SkeletonPhoneCreateInput);
let SkeletonPhoneCondition = class SkeletonPhoneCondition extends (0, graphql_1.PartialType)(SkeletonPhoneCreateInput, graphql_1.InputType) {
};
exports.SkeletonPhoneCondition = SkeletonPhoneCondition;
exports.SkeletonPhoneCondition = SkeletonPhoneCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: SkeletonPhoneType })
], SkeletonPhoneCondition);
let SkeletonPhoneUpdateInput = class SkeletonPhoneUpdateInput extends (0, graphql_1.OmitType)(SkeletonPhoneType, ['userId', 'SkeletonUser'], graphql_1.InputType) {
};
exports.SkeletonPhoneUpdateInput = SkeletonPhoneUpdateInput;
exports.SkeletonPhoneUpdateInput = SkeletonPhoneUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: SkeletonPhoneType })
], SkeletonPhoneUpdateInput);
//# sourceMappingURL=skeleton-phone.dto.js.map