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
exports.TaskEventUpdateInput = exports.TaskEventCondition = exports.TaskEventCreateInput = exports.TaskEventType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_1 = require("@nest-yalc-2/crud-gen/object.decorator");
const uuid_scalar_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar");
const returnValue_1 = __importDefault(require("@nest-yalc-2/utils/returnValue"));
const task_event_entity_1 = require("@nest-yalc-2/task-system-module/src/task-event.entity");
let TaskEventType = class TaskEventType extends task_event_entity_1.TaskEvent {
    constructor(data) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
};
exports.TaskEventType = TaskEventType;
__decorate([
    (0, object_decorator_1.ModelField)({ gqlType: (0, returnValue_1.default)(uuid_scalar_1.UUIDScalar), isRequired: true }),
    (0, graphql_1.Field)(() => uuid_scalar_1.UUIDScalar),
    __metadata("design:type", String)
], TaskEventType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskEventType.prototype, "title", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskEventType.prototype, "description", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskEventType.prototype, "status", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], TaskEventType.prototype, "startAt", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskEventType.prototype, "endAt", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TaskEventType.prototype, "allDay", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({
        gqlType: (0, returnValue_1.default)(uuid_scalar_1.UUIDScalar),
        gqlOptions: { nullable: true },
    }),
    (0, graphql_1.Field)(() => uuid_scalar_1.UUIDScalar, { nullable: true }),
    __metadata("design:type", Object)
], TaskEventType.prototype, "projectId", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskEventType.prototype, "location", void 0);
exports.TaskEventType = TaskEventType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], TaskEventType);
let TaskEventCreateInput = class TaskEventCreateInput extends (0, graphql_1.OmitType)(TaskEventType, ['createdAt', 'updatedAt'], graphql_1.InputType) {
};
exports.TaskEventCreateInput = TaskEventCreateInput;
exports.TaskEventCreateInput = TaskEventCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)()
], TaskEventCreateInput);
let TaskEventCondition = class TaskEventCondition extends (0, graphql_1.PartialType)(TaskEventCreateInput, graphql_1.InputType) {
};
exports.TaskEventCondition = TaskEventCondition;
exports.TaskEventCondition = TaskEventCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskEventType })
], TaskEventCondition);
let TaskEventUpdateInput = class TaskEventUpdateInput extends (0, graphql_1.PartialType)(TaskEventCreateInput, graphql_1.InputType) {
};
exports.TaskEventUpdateInput = TaskEventUpdateInput;
exports.TaskEventUpdateInput = TaskEventUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskEventType })
], TaskEventUpdateInput);
//# sourceMappingURL=task-event.dto.js.map