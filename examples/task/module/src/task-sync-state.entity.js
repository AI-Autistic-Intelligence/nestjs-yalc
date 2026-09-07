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
exports.TaskSyncState = void 0;
const timestamp_entity_js_1 = require("@nest-yalc-2/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let TaskSyncState = class TaskSyncState extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
};
exports.TaskSyncState = TaskSyncState;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], TaskSyncState.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 36 }),
    __metadata("design:type", String)
], TaskSyncState.prototype, "externalRefId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'active' }),
    __metadata("design:type", String)
], TaskSyncState.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", Object)
], TaskSyncState.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", Object)
], TaskSyncState.prototype, "lastDirection", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", Object)
], TaskSyncState.prototype, "remoteVersion", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", Object)
], TaskSyncState.prototype, "localVersionHash", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], TaskSyncState.prototype, "lastError", void 0);
exports.TaskSyncState = TaskSyncState = __decorate([
    (0, typeorm_1.Entity)('task-sync-state'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], TaskSyncState);
//# sourceMappingURL=task-sync-state.entity.js.map