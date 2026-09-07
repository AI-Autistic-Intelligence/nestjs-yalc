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
exports.TaskExternalRef = void 0;
const timestamp_entity_js_1 = require("@nest-yalc-2/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let TaskExternalRef = class TaskExternalRef extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
};
exports.TaskExternalRef = TaskExternalRef;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], TaskExternalRef.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], TaskExternalRef.prototype, "internalType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 36 }),
    __metadata("design:type", String)
], TaskExternalRef.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], TaskExternalRef.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", Object)
], TaskExternalRef.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", Object)
], TaskExternalRef.prototype, "container", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], TaskExternalRef.prototype, "externalId", void 0);
exports.TaskExternalRef = TaskExternalRef = __decorate([
    (0, typeorm_1.Entity)('task-external-ref'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], TaskExternalRef);
//# sourceMappingURL=task-external-ref.entity.js.map