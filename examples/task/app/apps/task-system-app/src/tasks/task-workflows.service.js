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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskWorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const observability_1 = require("@nest-yalc-2/observability");
const tasks_api_client_1 = require("@nest-yalc-2/task-system-module/src/client/tasks-api.client");
const tasks_domain_events_service_1 = require("./tasks.domain-events.service");
let TaskWorkflowsService = class TaskWorkflowsService {
    constructor(client, events, telemetry) {
        this.client = client;
        this.events = events;
        this.telemetry = telemetry;
    }
    async getBacklog() {
        return this.telemetry.measure('task-workflows.backlog', async () => {
            const tasks = await this.client.listTasks();
            const backlog = tasks.list.filter((task) => task.status === 'todo');
            return Object.assign(Object.assign({}, tasks), { list: backlog, pageData: Object.assign(Object.assign({}, tasks.pageData), { count: backlog.length }) });
        });
    }
    async createProjectWithTask(payload) {
        return this.telemetry.measure('task-workflows.project-with-task', async () => {
            var _a, _b;
            const project = await this.client.createProject(payload.project);
            const task = await this.client.createTask(Object.assign(Object.assign({}, payload.task), { projectId: (_a = payload.task.projectId) !== null && _a !== void 0 ? _a : project.guid }));
            await this.events.emitTaskCreated(task.guid, (_b = task.projectId) !== null && _b !== void 0 ? _b : project.guid);
            return { project, task };
        });
    }
    async completeTask(taskId) {
        return this.telemetry.measure('task-workflows.complete-task', async () => {
            await this.client.updateTask(taskId, {
                status: 'done',
            });
            const task = await this.client.getTask(taskId);
            await this.events.emitTaskStatusChanged(task.guid, task.status);
            return { task };
        });
    }
    async listProjectTasks(projectId) {
        return this.telemetry.measure('task-workflows.project-tasks', () => this.client.listProjectTasks(projectId));
    }
};
exports.TaskWorkflowsService = TaskWorkflowsService;
exports.TaskWorkflowsService = TaskWorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tasks_api_client_1.TasksApiClient !== "undefined" && tasks_api_client_1.TasksApiClient) === "function" ? _a : Object, tasks_domain_events_service_1.TasksDomainEventsService,
        observability_1.TelemetryService])
], TaskWorkflowsService);
//# sourceMappingURL=task-workflows.service.js.map