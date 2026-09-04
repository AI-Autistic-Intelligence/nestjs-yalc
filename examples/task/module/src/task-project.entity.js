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
exports.TaskProject = void 0;
const timestamp_entity_js_1 = require("@nestjs-yalc/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const task_event_entity_js_1 = require("./task-event.entity.js");
const task_item_entity_js_1 = require("./task-item.entity.js");
let TaskProject = class TaskProject extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
};
exports.TaskProject = TaskProject;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], TaskProject.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], TaskProject.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], TaskProject.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'active' }),
    __metadata("design:type", String)
], TaskProject.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_item_entity_js_1.TaskItem, (task) => task.project),
    __metadata("design:type", Object)
], TaskProject.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_event_entity_js_1.TaskEvent, (event) => event.project),
    __metadata("design:type", Object)
], TaskProject.prototype, "events", void 0);
exports.TaskProject = TaskProject = __decorate([
    (0, typeorm_1.Entity)('task-project'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], TaskProject);
//# sourceMappingURL=task-project.entity.js.map