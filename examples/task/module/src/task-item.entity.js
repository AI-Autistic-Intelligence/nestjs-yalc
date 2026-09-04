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
exports.TaskItem = void 0;
const timestamp_entity_js_1 = require("@nestjs-yalc/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const task_project_entity_js_1 = require("./task-project.entity.js");
let TaskItem = class TaskItem extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
};
exports.TaskItem = TaskItem;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], TaskItem.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], TaskItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], TaskItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'todo' }),
    __metadata("design:type", String)
], TaskItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 36 }),
    __metadata("design:type", Object)
], TaskItem.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_project_entity_js_1.TaskProject, (project) => project.tasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId', referencedColumnName: 'guid' }),
    __metadata("design:type", Object)
], TaskItem.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", Object)
], TaskItem.prototype, "dueAt", void 0);
exports.TaskItem = TaskItem = __decorate([
    (0, typeorm_1.Entity)('task-item'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], TaskItem);
//# sourceMappingURL=task-item.entity.js.map