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
exports.TaskExternalRefUpdateInput = exports.TaskExternalRefCondition = exports.TaskExternalRefCreateInput = exports.TaskExternalRefType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nest-yalc-2/crud-gen/object.decorator.js");
const returnValue_js_1 = __importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const task_external_ref_entity_js_1 = require("./task-external-ref.entity.js");
let TaskExternalRefType = class TaskExternalRefType extends task_external_ref_entity_js_1.TaskExternalRef {
    constructor(data) {
        super();
        if (data)
            Object.assign(this, data);
    }
};
exports.TaskExternalRefType = TaskExternalRefType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    __metadata("design:type", String)
], TaskExternalRefType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskExternalRefType.prototype, "internalType", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, graphql_1.Field)(() => uuid_scalar_js_1.UUIDScalar),
    __metadata("design:type", String)
], TaskExternalRefType.prototype, "internalId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskExternalRefType.prototype, "provider", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskExternalRefType.prototype, "account", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskExternalRefType.prototype, "container", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskExternalRefType.prototype, "externalId", void 0);
exports.TaskExternalRefType = TaskExternalRefType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], TaskExternalRefType);
let TaskExternalRefCreateInput = class TaskExternalRefCreateInput extends (0, graphql_1.OmitType)(TaskExternalRefType, ['createdAt', 'updatedAt'], graphql_1.InputType) {
};
exports.TaskExternalRefCreateInput = TaskExternalRefCreateInput;
exports.TaskExternalRefCreateInput = TaskExternalRefCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], TaskExternalRefCreateInput);
let TaskExternalRefCondition = class TaskExternalRefCondition extends (0, graphql_1.PartialType)(TaskExternalRefCreateInput, graphql_1.InputType) {
};
exports.TaskExternalRefCondition = TaskExternalRefCondition;
exports.TaskExternalRefCondition = TaskExternalRefCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: TaskExternalRefType })
], TaskExternalRefCondition);
let TaskExternalRefUpdateInput = class TaskExternalRefUpdateInput extends (0, graphql_1.PartialType)(TaskExternalRefCreateInput, graphql_1.InputType) {
};
exports.TaskExternalRefUpdateInput = TaskExternalRefUpdateInput;
exports.TaskExternalRefUpdateInput = TaskExternalRefUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: TaskExternalRefType })
], TaskExternalRefUpdateInput);
//# sourceMappingURL=task-external-ref.dto.js.map