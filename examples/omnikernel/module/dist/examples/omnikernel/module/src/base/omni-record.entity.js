import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany, TableInheritance } from 'typeorm';
import { OmniNamedEntity } from './omni-named.entity.js';
import { OmniRelationEntity } from './omni-relation.entity.js';
import { OmniRecordStatus } from '../omni-record-status.enum.js';
let OmniRecordEntity = class OmniRecordEntity extends OmniNamedEntity {
};
__decorate([
    Column({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], OmniRecordEntity.prototype, "kind", void 0);
__decorate([
    Column({
        type: 'varchar',
        default: OmniRecordStatus.Draft,
        enum: Object.values(OmniRecordStatus),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniRecordEntity.prototype, "status", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payload", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    Column({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaVersion", void 0);
__decorate([
    OneToMany(() => OmniRelationEntity, (relation) => relation.sourceRecord),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "outgoingRelations", void 0);
__decorate([
    OneToMany(() => OmniRelationEntity, (relation) => relation.targetRecord),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "incomingRelations", void 0);
OmniRecordEntity = __decorate([
    Entity('omni-record'),
    Index('omni_record_scope_kind_status_guid_idx', [
        'scopeId',
        'kind',
        'status',
        'guid',
    ]),
    TableInheritance({
        column: {
            name: 'recordType',
            type: 'varchar',
            length: 32,
        },
    }),
    ObjectType({ isAbstract: true })
], OmniRecordEntity);
export { OmniRecordEntity };
//# sourceMappingURL=omni-record.entity.js.map