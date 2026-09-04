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
exports.TasksApiClient = exports.TASKS_CLIENT_HTTP_API_STRATEGY = exports.TASKS_CLIENT_LOCAL_API_STRATEGY = exports.TASKS_CLIENT_API_STRATEGY = void 0;
const common_1 = require("@nestjs/common");
exports.TASKS_CLIENT_API_STRATEGY = 'TASKS_CLIENT_API_STRATEGY';
exports.TASKS_CLIENT_LOCAL_API_STRATEGY = 'TASKS_CLIENT_LOCAL_API_STRATEGY';
exports.TASKS_CLIENT_HTTP_API_STRATEGY = 'TASKS_CLIENT_HTTP_API_STRATEGY';
let TasksApiClient = class TasksApiClient {
    constructor(api) {
        this.api = api;
    }
    async listTasks(query = {}) {
        const res = await this.api.get('/tasks', { parameters: query });
        return res.data;
    }
    async listProjectTasks(projectId) {
        return this.listTasks({ projectId });
    }
    async getTask(taskId) {
        const res = await this.api.get(`/tasks/${taskId}`);
        return res.data;
    }
    async createTask(payload) {
        const res = await this.api.post('/tasks', { data: payload });
        return res.data;
    }
    async updateTask(taskId, payload) {
        const res = await this.api.call(`/tasks/${taskId}`, {
            method: 'PUT',
            data: payload,
        });
        return res.data;
    }
    async createProject(payload) {
        const res = await this.api.post('/projects', { data: payload });
        return res.data;
    }
};
exports.TasksApiClient = TasksApiClient;
exports.TasksApiClient = TasksApiClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exports.TASKS_CLIENT_API_STRATEGY)),
    __metadata("design:paramtypes", [Object])
], TasksApiClient);
//# sourceMappingURL=tasks-api.client.js.map