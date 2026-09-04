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
exports.OmniBaseEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let OmniBaseEntity = class OmniBaseEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.scopeId = 'default';
    }
};
exports.OmniBaseEntity = OmniBaseEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', {
        name: 'scopeId',
        length: 64,
        default: 'default',
    }),
    __metadata("design:type", String)
], OmniBaseEntity.prototype, "scopeId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], OmniBaseEntity.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.VersionColumn)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], OmniBaseEntity.prototype, "revision", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Object)
], OmniBaseEntity.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OmniBaseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OmniBaseEntity.prototype, "updatedAt", void 0);
exports.OmniBaseEntity = OmniBaseEntity = __decorate([
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniBaseEntity);
//# sourceMappingURL=omni-base.entity.js.map