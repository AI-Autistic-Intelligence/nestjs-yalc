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
exports.TasksErrorsController = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nestjs-yalc/event-manager");
let TasksErrorsController = class TasksErrorsController {
    constructor(events) {
        this.events = events;
    }
    badRequest() {
        throw this.events.errorBadRequest('tasks.validation.failed', {
            response: { message: 'Invalid task payload' },
            data: { area: 'tasks' },
        });
    }
    notFound() {
        throw this.events.errorNotFound('tasks.resource.not-found', {
            response: { message: 'Task not found' },
            data: { area: 'tasks' },
        });
    }
};
exports.TasksErrorsController = TasksErrorsController;
__decorate([
    (0, common_1.Get)('bad-request'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksErrorsController.prototype, "badRequest", null);
__decorate([
    (0, common_1.Get)('not-found'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksErrorsController.prototype, "notFound", null);
exports.TasksErrorsController = TasksErrorsController = __decorate([
    (0, common_1.Controller)('tasks/errors'),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService])
], TasksErrorsController);
//# sourceMappingURL=tasks.errors.controller.js.map