import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OmniBaseEntity } from './omni-base.entity.js';
import { OmniRecordEntity } from './omni-record.entity.js';
import { OmniRelationStatus } from '../omni-relation-status.enum.js';
let OmniRelationEntity = class OmniRelationEntity extends OmniBaseEntity {
};
__decorate([
    Column({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "sourceRecordId", void 0);
__decorate([
    ManyToOne(() => OmniRecordEntity, (record) => record.outgoingRelations),
    JoinColumn([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'sourceRecordId', referencedColumnName: 'guid' },
    ]),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "sourceRecord", void 0);
__decorate([
    Column({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "targetRecordId", void 0);
__decorate([
    ManyToOne(() => OmniRecordEntity, (record) => record.incomingRelations),
    JoinColumn([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'targetRecordId', referencedColumnName: 'guid' },
    ]),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "targetRecord", void 0);
__decorate([
    Column({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "kind", void 0);
__decorate([
    Column({
        type: 'varchar',
        default: OmniRelationStatus.Active,
        enum: Object.values(OmniRelationStatus),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "status", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payload", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    Column({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaVersion", void 0);
OmniRelationEntity = __decorate([
    Entity('omni-relation'),
    Index('omni_relation_scope_source_kind_status_created_guid_idx', [
        'scopeId',
        'sourceRecordId',
        'kind',
        'status',
        'createdAt',
        'guid',
    ]),
    Index('omni_relation_scope_target_kind_status_created_guid_idx', [
        'scopeId',
        'targetRecordId',
        'kind',
        'status',
        'createdAt',
        'guid',
    ]),
    Index('omni_relation_scope_edge_kind_status_unique', ['scopeId', 'sourceRecordId', 'targetRecordId', 'kind', 'status'], { unique: true }),
    ObjectType({ isAbstract: true })
], OmniRelationEntity);
export { OmniRelationEntity };
//# sourceMappingURL=omni-relation.entity.js.map