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
exports.TaskWorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const task_workflows_service_1 = require("./task-workflows.service");
let TaskWorkflowsController = class TaskWorkflowsController {
    constructor(service) {
        this.service = service;
    }
    async getBacklog() {
        return this.service.getBacklog();
    }
    async createProjectWithTask(payload) {
        return this.service.createProjectWithTask(payload);
    }
    async completeTask(id) {
        return this.service.completeTask(id);
    }
    async listProjectTasks(projectId) {
        return this.service.listProjectTasks(projectId);
    }
};
exports.TaskWorkflowsController = TaskWorkflowsController;
__decorate([
    (0, common_1.Get)('backlog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskWorkflowsController.prototype, "getBacklog", null);
__decorate([
    (0, common_1.Post)('project-with-task'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskWorkflowsController.prototype, "createProjectWithTask", null);
__decorate([
    (0, common_1.Put)('tasks/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskWorkflowsController.prototype, "completeTask", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/tasks'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskWorkflowsController.prototype, "listProjectTasks", null);
exports.TaskWorkflowsController = TaskWorkflowsController = __decorate([
    (0, common_1.Controller)('task-workflows'),
    __metadata("design:paramtypes", [task_workflows_service_1.TaskWorkflowsService])
], TaskWorkflowsController);
//# sourceMappingURL=task-workflows.controller.js.map