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
exports.TasksEventsClient = exports.TASK_STATUS_CHANGED_EVENT = exports.TASK_CREATED_EVENT = exports.TASK_EVENTS_RABBITMQ_STRATEGY = exports.TASK_EVENTS_LOCAL_STRATEGY = exports.TASK_EVENTS_STRATEGY = void 0;
const common_1 = require("@nestjs/common");
exports.TASK_EVENTS_STRATEGY = 'TASK_EVENTS_STRATEGY';
exports.TASK_EVENTS_LOCAL_STRATEGY = 'TASK_EVENTS_LOCAL_STRATEGY';
exports.TASK_EVENTS_RABBITMQ_STRATEGY = 'TASK_EVENTS_RABBITMQ_STRATEGY';
exports.TASK_CREATED_EVENT = 'task-system.tasks.created';
exports.TASK_STATUS_CHANGED_EVENT = 'task-system.tasks.status-changed';
let TasksEventsClient = class TasksEventsClient {
    constructor(events) {
        this.events = events;
    }
    async emitTaskCreated(taskId, projectId) {
        const payload = {
            eventName: exports.TASK_CREATED_EVENT,
            taskId,
            projectId: projectId !== null && projectId !== void 0 ? projectId : null,
            occurredAt: new Date().toISOString(),
        };
        await this.events.emitAsync(exports.TASK_CREATED_EVENT, payload);
    }
    async emitTaskStatusChanged(taskId, status) {
        const payload = {
            eventName: exports.TASK_STATUS_CHANGED_EVENT,
            taskId,
            status,
            occurredAt: new Date().toISOString(),
        };
        await this.events.emitAsync(exports.TASK_STATUS_CHANGED_EVENT, payload);
    }
};
exports.TasksEventsClient = TasksEventsClient;
exports.TasksEventsClient = TasksEventsClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exports.TASK_EVENTS_STRATEGY)),
    __metadata("design:paramtypes", [Object])
], TasksEventsClient);
//# sourceMappingURL=tasks-events.client.js.map