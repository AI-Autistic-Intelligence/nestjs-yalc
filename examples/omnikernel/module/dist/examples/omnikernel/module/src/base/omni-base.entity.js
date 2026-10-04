import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn, VersionColumn, } from 'typeorm';
let OmniBaseEntity = class OmniBaseEntity extends BaseEntity {
    constructor() {
        super(...arguments);
        this.scopeId = 'default';
    }
};
__decorate([
    PrimaryColumn('varchar', {
        name: 'scopeId',
        length: 64,
        default: 'default',
    }),
    __metadata("design:type", String)
], OmniBaseEntity.prototype, "scopeId", void 0);
__decorate([
    PrimaryColumn('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], OmniBaseEntity.prototype, "guid", void 0);
__decorate([
    VersionColumn({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], OmniBaseEntity.prototype, "revision", void 0);
__decorate([
    DeleteDateColumn({ nullable: true }),
    __metadata("design:type", Object)
], OmniBaseEntity.prototype, "deletedAt", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], OmniBaseEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], OmniBaseEntity.prototype, "updatedAt", void 0);
OmniBaseEntity = __decorate([
    ObjectType({ isAbstract: true })
], OmniBaseEntity);
export { OmniBaseEntity };
//# sourceMappingURL=omni-base.entity.js.map