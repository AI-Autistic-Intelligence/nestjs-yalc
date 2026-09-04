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
exports.TaskEventsLocalHandler = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const tasks_events_client_1 = require("@nestjs-yalc/task-system-module/src/events/tasks-events.client");
const task_events_audit_store_1 = require("./task-events-audit.store");
let TaskEventsLocalHandler = class TaskEventsLocalHandler {
    constructor(events, audit) {
        this.events = events;
        this.audit = audit;
        this.onTaskCreated = (payload) => {
            this.audit.record({
                eventName: tasks_events_client_1.TASK_CREATED_EVENT,
                source: 'local',
                payload,
            });
        };
        this.onTaskStatusChanged = (payload) => {
            this.audit.record({
                eventName: tasks_events_client_1.TASK_STATUS_CHANGED_EVENT,
                source: 'local',
                payload,
            });
        };
    }
    onModuleInit() {
        this.events.emitter.on(tasks_events_client_1.TASK_CREATED_EVENT, this.onTaskCreated);
        this.events.emitter.on(tasks_events_client_1.TASK_STATUS_CHANGED_EVENT, this.onTaskStatusChanged);
    }
    onModuleDestroy() {
        this.events.emitter.off(tasks_events_client_1.TASK_CREATED_EVENT, this.onTaskCreated);
        this.events.emitter.off(tasks_events_client_1.TASK_STATUS_CHANGED_EVENT, this.onTaskStatusChanged);
    }
};
exports.TaskEventsLocalHandler = TaskEventsLocalHandler;
exports.TaskEventsLocalHandler = TaskEventsLocalHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService,
        task_events_audit_store_1.TaskEventsAuditStore])
], TaskEventsLocalHandler);
//# sourceMappingURL=task-events-local.handler.js.map