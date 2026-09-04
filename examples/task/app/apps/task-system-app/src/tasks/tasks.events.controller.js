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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksEventsController = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const tasks_domain_events_service_1 = require("./tasks.domain-events.service");
let TasksEventsController = class TasksEventsController {
    constructor(service) {
        this.service = service;
    }
    async emitDemoEvents() {
        const taskId = (0, node_crypto_1.randomUUID)();
        const projectId = (0, node_crypto_1.randomUUID)();
        await this.service.emitTaskCreated(taskId, projectId);
        await this.service.emitTaskStatusChanged(taskId, 'todo');
        return {
            ok: true,
            taskId,
            projectId,
        };
    }
};
exports.TasksEventsController = TasksEventsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksEventsController.prototype, "emitDemoEvents", null);
exports.TasksEventsController = TasksEventsController = __decorate([
    (0, common_1.Controller)('tasks-events'),
    __metadata("design:paramtypes", [tasks_domain_events_service_1.TasksDomainEventsService])
], TasksEventsController);
//# sourceMappingURL=tasks.events.controller.js.map