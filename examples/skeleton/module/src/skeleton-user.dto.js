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
exports.SkeletonUserUpdateInput = exports.SkeletonUserCondition = exports.SkeletonUserCreateInput = exports.SkeletonUserType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nestjs-yalc/crud-gen/object.decorator.js");
const skeleton_user_entity_js_1 = require("./skeleton-user.entity.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const uuid_scalar_js_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar.js");
const skeleton_phone_dto_js_1 = require("./skeleton-phone.dto.js");
let SkeletonUserType = class SkeletonUserType extends skeleton_user_entity_js_1.SkeletonUser {
    constructor(data) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
};
exports.SkeletonUserType = SkeletonUserType;
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: 'The user first name',
        },
    }),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "firstName", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: 'The user last name',
        },
    }),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "lastName", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: 'The user email address',
        },
    }),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "email", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        relation: {
            type: () => skeleton_phone_dto_js_1.SkeletonPhoneType,
            relationType: 'one-to-many',
            sourceKey: { dst: 'guid', alias: 'guid' },
            targetKey: { dst: 'userId', alias: 'userId' },
        },
    }),
    __metadata("design:type", Array)
], SkeletonUserType.prototype, "SkeletonPhone", void 0);
__decorate([
    (0, graphql_1.HideField)(),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "password", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar),
        gqlOptions: {
            description: 'The user ID generated with UUID',
        },
        isRequired: true,
    }),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        gqlOptions: {
            description: "It's the combination of firstName and lastName",
        },
        denyFilter: true,
    }),
    __metadata("design:type", String)
], SkeletonUserType.prototype, "fullName", void 0);
exports.SkeletonUserType = SkeletonUserType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], SkeletonUserType);
let SkeletonUserCreateInput = class SkeletonUserCreateInput extends (0, graphql_1.OmitType)(SkeletonUserType, ['SkeletonPhone', 'fullName', 'createdAt', 'updatedAt'], graphql_1.InputType) {
};
exports.SkeletonUserCreateInput = SkeletonUserCreateInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SkeletonUserCreateInput.prototype, "password", void 0);
exports.SkeletonUserCreateInput = SkeletonUserCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], SkeletonUserCreateInput);
let SkeletonUserCondition = class SkeletonUserCondition extends (0, graphql_1.PartialType)(SkeletonUserCreateInput, graphql_1.InputType) {
};
exports.SkeletonUserCondition = SkeletonUserCondition;
exports.SkeletonUserCondition = SkeletonUserCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: SkeletonUserType })
], SkeletonUserCondition);
let SkeletonUserUpdateInput = class SkeletonUserUpdateInput extends (0, graphql_1.PartialType)(SkeletonUserCreateInput, graphql_1.InputType) {
};
exports.SkeletonUserUpdateInput = SkeletonUserUpdateInput;
exports.SkeletonUserUpdateInput = SkeletonUserUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: SkeletonUserType })
], SkeletonUserUpdateInput);
//# sourceMappingURL=skeleton-user.dto.js.map