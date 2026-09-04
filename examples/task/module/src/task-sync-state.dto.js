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
exports.TaskSyncStateUpdateInput = exports.TaskSyncStateCondition = exports.TaskSyncStateCreateInput = exports.TaskSyncStateType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_js_1 = require("@nestjs-yalc/crud-gen/object.decorator.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const uuid_scalar_js_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar.js");
const task_sync_state_entity_js_1 = require("./task-sync-state.entity.js");
let TaskSyncStateType = class TaskSyncStateType extends task_sync_state_entity_js_1.TaskSyncState {
    constructor(data) {
        super();
        if (data)
            Object.assign(this, data);
    }
};
exports.TaskSyncStateType = TaskSyncStateType;
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    __metadata("design:type", String)
], TaskSyncStateType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlType: (0, returnValue_js_1.default)(uuid_scalar_js_1.UUIDScalar), isRequired: true }),
    (0, graphql_1.Field)(() => uuid_scalar_js_1.UUIDScalar),
    __metadata("design:type", String)
], TaskSyncStateType.prototype, "externalRefId", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskSyncStateType.prototype, "status", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskSyncStateType.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskSyncStateType.prototype, "lastDirection", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskSyncStateType.prototype, "remoteVersion", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskSyncStateType.prototype, "localVersionHash", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskSyncStateType.prototype, "lastError", void 0);
exports.TaskSyncStateType = TaskSyncStateType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_js_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], TaskSyncStateType);
let TaskSyncStateCreateInput = class TaskSyncStateCreateInput extends (0, graphql_1.OmitType)(TaskSyncStateType, ['createdAt', 'updatedAt'], graphql_1.InputType) {
};
exports.TaskSyncStateCreateInput = TaskSyncStateCreateInput;
exports.TaskSyncStateCreateInput = TaskSyncStateCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)()
], TaskSyncStateCreateInput);
let TaskSyncStateCondition = class TaskSyncStateCondition extends (0, graphql_1.PartialType)(TaskSyncStateCreateInput, graphql_1.InputType) {
};
exports.TaskSyncStateCondition = TaskSyncStateCondition;
exports.TaskSyncStateCondition = TaskSyncStateCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: TaskSyncStateType })
], TaskSyncStateCondition);
let TaskSyncStateUpdateInput = class TaskSyncStateUpdateInput extends (0, graphql_1.PartialType)(TaskSyncStateCreateInput, graphql_1.InputType) {
};
exports.TaskSyncStateUpdateInput = TaskSyncStateUpdateInput;
exports.TaskSyncStateUpdateInput = TaskSyncStateUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_js_1.ModelObject)({ copyFrom: TaskSyncStateType })
], TaskSyncStateUpdateInput);
//# sourceMappingURL=task-sync-state.dto.js.map