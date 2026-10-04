import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { OmniBaseEntity } from './omni-base.entity.js';
let OmniNamedEntity = class OmniNamedEntity extends OmniBaseEntity {
};
__decorate([
    Column({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniNamedEntity.prototype, "externalId", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OmniNamedEntity.prototype, "title", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", Object)
], OmniNamedEntity.prototype, "slug", void 0);
OmniNamedEntity = __decorate([
    Entity('omni-named'),
    ObjectType({ isAbstract: true })
], OmniNamedEntity);
export { OmniNamedEntity };
//# sourceMappingURL=omni-named.entity.js.map