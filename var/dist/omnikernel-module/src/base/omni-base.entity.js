"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniBaseEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let OmniBaseEntity = class OmniBaseEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.scopeId = 'default';
    }
};
exports.OmniBaseEntity = OmniBaseEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', {
        name: 'scopeId',
        length: 64,
        default: 'default',
    }),
    tslib_1.__metadata("design:type", String)
], OmniBaseEntity.prototype, "scopeId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    tslib_1.__metadata("design:type", String)
], OmniBaseEntity.prototype, "guid", void 0);
tslib_1.__decorate([
    (0, typeorm_1.VersionColumn)({ type: 'integer', default: 1 }),
    tslib_1.__metadata("design:type", Number)
], OmniBaseEntity.prototype, "revision", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniBaseEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], OmniBaseEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], OmniBaseEntity.prototype, "updatedAt", void 0);
exports.OmniBaseEntity = OmniBaseEntity = tslib_1.__decorate([
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniBaseEntity);
//# sourceMappingURL=omni-base.entity.js.map