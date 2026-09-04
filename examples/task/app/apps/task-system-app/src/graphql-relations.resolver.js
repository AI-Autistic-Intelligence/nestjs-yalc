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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProjectRelationsResolver = exports.TaskEventRelationsResolver = exports.TaskItemRelationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const task_event_dto_1 = require("./events/task-event.dto");
const task_app_omni_event_service_1 = require("./omni-task-app/task-app-omni-event.service");
const task_app_omni_project_service_1 = require("./omni-task-app/task-app-omni-project.service");
const task_app_omni_task_service_1 = require("./omni-task-app/task-app-omni-task.service");
const task_project_dto_1 = require("./projects/task-project.dto");
const task_item_dto_1 = require("./tasks/task-item.dto");
let TaskItemRelationsResolver = class TaskItemRelationsResolver {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async project(task) {
        if (!task.projectId)
            return null;
        return this.projectService.getById(task.projectId);
    }
};
exports.TaskItemRelationsResolver = TaskItemRelationsResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => task_project_dto_1.TaskProjectType, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_item_dto_1.TaskItemType]),
    __metadata("design:returntype", Promise)
], TaskItemRelationsResolver.prototype, "project", null);
exports.TaskItemRelationsResolver = TaskItemRelationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => task_item_dto_1.TaskItemType),
    __metadata("design:paramtypes", [task_app_omni_project_service_1.TaskAppOmniProjectService])
], TaskItemRelationsResolver);
let TaskEventRelationsResolver = class TaskEventRelationsResolver {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async project(event) {
        if (!event.projectId)
            return null;
        return this.projectService.getById(event.projectId);
    }
};
exports.TaskEventRelationsResolver = TaskEventRelationsResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => task_project_dto_1.TaskProjectType, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_event_dto_1.TaskEventType]),
    __metadata("design:returntype", Promise)
], TaskEventRelationsResolver.prototype, "project", null);
exports.TaskEventRelationsResolver = TaskEventRelationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => task_event_dto_1.TaskEventType),
    __metadata("design:paramtypes", [task_app_omni_project_service_1.TaskAppOmniProjectService])
], TaskEventRelationsResolver);
let TaskProjectRelationsResolver = class TaskProjectRelationsResolver {
    constructor(taskService, eventService) {
        this.taskService = taskService;
        this.eventService = eventService;
    }
    async tasks(project) {
        return (await this.taskService.list({ projectId: project.guid })).nodes;
    }
    async events(project) {
        return (await this.eventService.list({ projectId: project.guid })).nodes;
    }
};
exports.TaskProjectRelationsResolver = TaskProjectRelationsResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => [task_item_dto_1.TaskItemType], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_project_dto_1.TaskProjectType]),
    __metadata("design:returntype", Promise)
], TaskProjectRelationsResolver.prototype, "tasks", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [task_event_dto_1.TaskEventType], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_project_dto_1.TaskProjectType]),
    __metadata("design:returntype", Promise)
], TaskProjectRelationsResolver.prototype, "events", null);
exports.TaskProjectRelationsResolver = TaskProjectRelationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => task_project_dto_1.TaskProjectType),
    __metadata("design:paramtypes", [task_app_omni_task_service_1.TaskAppOmniTaskService,
        task_app_omni_event_service_1.TaskAppOmniEventService])
], TaskProjectRelationsResolver);
//# sourceMappingURL=graphql-relations.resolver.js.map