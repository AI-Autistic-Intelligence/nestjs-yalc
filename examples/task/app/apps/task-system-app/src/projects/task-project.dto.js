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
exports.TaskProjectUpdateInput = exports.TaskProjectCondition = exports.TaskProjectCreateInput = exports.TaskProjectType = void 0;
const graphql_1 = require("@nestjs/graphql");
const object_decorator_1 = require("@nestjs-yalc/crud-gen/object.decorator");
const uuid_scalar_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const task_project_entity_1 = require("@nestjs-yalc/task-system-module/src/task-project.entity");
let TaskProjectType = class TaskProjectType extends task_project_entity_1.TaskProject {
    constructor(data) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
};
exports.TaskProjectType = TaskProjectType;
__decorate([
    (0, object_decorator_1.ModelField)({ gqlType: (0, returnValue_1.default)(uuid_scalar_1.UUIDScalar), isRequired: true }),
    (0, graphql_1.Field)(() => uuid_scalar_1.UUIDScalar),
    __metadata("design:type", String)
], TaskProjectType.prototype, "guid", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskProjectType.prototype, "name", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({ gqlOptions: { nullable: true } }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Object)
], TaskProjectType.prototype, "description", void 0);
__decorate([
    (0, object_decorator_1.ModelField)({}),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TaskProjectType.prototype, "status", void 0);
exports.TaskProjectType = TaskProjectType = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, object_decorator_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], TaskProjectType);
let TaskProjectCreateInput = class TaskProjectCreateInput extends (0, graphql_1.OmitType)(TaskProjectType, ['createdAt', 'updatedAt'], graphql_1.InputType) {
};
exports.TaskProjectCreateInput = TaskProjectCreateInput;
exports.TaskProjectCreateInput = TaskProjectCreateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)()
], TaskProjectCreateInput);
let TaskProjectCondition = class TaskProjectCondition extends (0, graphql_1.PartialType)(TaskProjectCreateInput, graphql_1.InputType) {
};
exports.TaskProjectCondition = TaskProjectCondition;
exports.TaskProjectCondition = TaskProjectCondition = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskProjectType })
], TaskProjectCondition);
let TaskProjectUpdateInput = class TaskProjectUpdateInput extends (0, graphql_1.PartialType)(TaskProjectCreateInput, graphql_1.InputType) {
};
exports.TaskProjectUpdateInput = TaskProjectUpdateInput;
exports.TaskProjectUpdateInput = TaskProjectUpdateInput = __decorate([
    (0, graphql_1.InputType)(),
    (0, object_decorator_1.ModelObject)({ copyFrom: TaskProjectType })
], TaskProjectUpdateInput);
//# sourceMappingURL=task-project.dto.js.map