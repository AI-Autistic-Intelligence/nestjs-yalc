import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { OmniBaseEntity } from './omni-base.entity.js';
import { OmniExternalRefInternalType } from '../omni-external-ref-internal-type.enum.js';
let OmniExternalRefEntity = class OmniExternalRefEntity extends OmniBaseEntity {
};
__decorate([
    Column({
        type: 'varchar',
        enum: Object.values(OmniExternalRefInternalType),
        length: 64,
    }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "internalType", void 0);
__decorate([
    Column({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "internalId", void 0);
__decorate([
    Column({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "provider", void 0);
__decorate([
    Column({ type: 'varchar', default: '', length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "account", void 0);
__decorate([
    Column({ type: 'varchar', default: '', length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "container", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "externalId", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payload", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    Column({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payloadSchemaVersion", void 0);
OmniExternalRefEntity = __decorate([
    Entity('omni-external-ref'),
    Index('omni_external_ref_scope_external_identity_unique', ['scopeId', 'provider', 'account', 'container', 'externalId'], { unique: true }),
    Index('omni_external_ref_scope_internal_lookup_idx', [
        'scopeId',
        'internalType',
        'internalId',
        'provider',
        'guid',
    ]),
    ObjectType({ isAbstract: true })
], OmniExternalRefEntity);
export { OmniExternalRefEntity };
//# sourceMappingURL=omni-external-ref.entity.js.map