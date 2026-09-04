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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksDomainEventsService = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const logger_factory_1 = require("@nestjs-yalc/logger/logger.factory");
const tasks_events_client_1 = require("@nestjs-yalc/task-system-module/src/events/tasks-events.client");
let TasksDomainEventsService = class TasksDomainEventsService {
    constructor(events, taskEvents) {
        this.events = events;
        this.taskEvents = taskEvents;
        this.logger = (0, logger_factory_1.AppLoggerFactory)('TaskSystem.Tasks');
    }
    async emitTaskCreated(taskId, projectId) {
        var _a;
        await this.events.log(['task-system', 'tasks', 'created'], {
            message: 'Task created',
            data: {
                taskId,
                projectId: projectId !== null && projectId !== void 0 ? projectId : null,
            },
            event: { await: true },
            eventAliases: ['tasks.created'],
            logger: {
                instance: this.logger,
            },
        });
        await ((_a = this.taskEvents) === null || _a === void 0 ? void 0 : _a.emitTaskCreated(taskId, projectId));
    }
    async emitTaskStatusChanged(taskId, status) {
        var _a;
        await this.events.log(['task-system', 'tasks', 'status-changed'], {
            message: 'Task status changed',
            data: {
                taskId,
                status,
            },
            event: { await: true },
            eventAliases: ['tasks.status-changed'],
            logger: {
                instance: this.logger,
            },
        });
        await ((_a = this.taskEvents) === null || _a === void 0 ? void 0 : _a.emitTaskStatusChanged(taskId, status));
    }
};
exports.TasksDomainEventsService = TasksDomainEventsService;
exports.TasksDomainEventsService = TasksDomainEventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService, typeof (_a = typeof tasks_events_client_1.TasksEventsClient !== "undefined" && tasks_events_client_1.TasksEventsClient) === "function" ? _a : Object])
], TasksDomainEventsService);
//# sourceMappingURL=tasks.domain-events.service.js.map