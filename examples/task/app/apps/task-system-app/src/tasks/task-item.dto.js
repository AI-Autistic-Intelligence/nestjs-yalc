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
exports.TaskItemUpdateInput = exports.TaskItemCondition = exports.TaskItemCreateInput = exports.TaskItemType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_1 = require("@nestjs-yalc/crud-gen/object.decorator");
const uuid_scalar_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const task_item_entity_1 = require("@nestjs-yalc/task-system-module/src/task-item.entity");
const task_project_entity_1 = require("@nestjs-yalc/task-system-module/src/task-project.entity");
const task_project_dto_1 = require("../projects/task-project.dto");
let TaskItemType = class TaskItemType extends task_item_entity_1.TaskItem {
    constructor(data) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
};
exports.TaskItemType = TaskItemType;
__decorate([
    (0, object_decorator_1.ModelField)({ gqlType: (0, returnValue_1.default)(uuid_scalar_1.UUIDScalar), isRequired: true }),
    (0, graphql_1.Field)(() => uuid_scalar_1.UUIDScalar),
    __metadata("design:type", String)
], TaskItemType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskItemType.prototype, "title", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskItemType.prototype, "description", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskItemType.prototype, "status", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({
        gqlType: (0, returnValue_1.default)(uuid_scalar_1.UUIDScalar),
        gqlOptions: { nullable: true },
    }),
    (0, graphql_1.Field)(() => uuid_scalar_1.UUIDScalar, { nullable: true }),
    __metadata("design:type", Object)
], TaskItemType.prototype, "projectId", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({
        gqlType: (0, returnValue_1.default)(task_project_dto_1.TaskProjectType),
        gqlOptions: { nullable: true },
        relation: {
            relationType: 'many-to-one',
            sourceKey: { dst: 'projectId', alias: 'projectId' },
            targetKey: { dst: 'guid', alias: 'guid' },
            type: () => task_project_entity_1.TaskProject,
        },
    }),
    (0, graphql_1.Field)(() => task_project_dto_1.TaskProjectType, { nullable: true }),
    __metadata("design:type", Object)
], TaskItemType.prototype, "project", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskItemType.prototype, "dueAt", void 0);
exports.TaskItemType = TaskItemType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], TaskItemType);
let TaskItemCreateInput = class TaskItemCreateInput extends (0, graphql_1.OmitType)(TaskItemType, ['createdAt', 'updatedAt', 'project'], graphql_1.InputType) {
};
exports.TaskItemCreateInput = TaskItemCreateInput;
exports.TaskItemCreateInput = TaskItemCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)()
], TaskItemCreateInput);
let TaskItemCondition = class TaskItemCondition extends (0, graphql_1.PartialType)(TaskItemCreateInput, graphql_1.InputType) {
};
exports.TaskItemCondition = TaskItemCondition;
exports.TaskItemCondition = TaskItemCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskItemType })
], TaskItemCondition);
let TaskItemUpdateInput = class TaskItemUpdateInput extends (0, graphql_1.PartialType)(TaskItemCreateInput, graphql_1.InputType) {
};
exports.TaskItemUpdateInput = TaskItemUpdateInput;
exports.TaskItemUpdateInput = TaskItemUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskItemType })
], TaskItemUpdateInput);
//# sourceMappingURL=task-item.dto.js.map