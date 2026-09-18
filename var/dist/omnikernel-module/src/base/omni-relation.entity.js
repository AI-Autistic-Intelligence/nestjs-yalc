"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_base_entity_js_1 = require("./omni-base.entity.js");
const omni_record_entity_js_1 = require("./omni-record.entity.js");
const omni_relation_status_enum_js_1 = require("../omni-relation-status.enum.js");
let OmniRelationEntity = class OmniRelationEntity extends omni_base_entity_js_1.OmniBaseEntity {
};
exports.OmniRelationEntity = OmniRelationEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    tslib_1.__metadata("design:type", String)
], OmniRelationEntity.prototype, "sourceRecordId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => omni_record_entity_js_1.OmniRecordEntity, (record) => record.outgoingRelations),
    (0, typeorm_1.JoinColumn)([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'sourceRecordId', referencedColumnName: 'guid' },
    ]),
    tslib_1.__metadata("design:type", Object)
], OmniRelationEntity.prototype, "sourceRecord", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    tslib_1.__metadata("design:type", String)
], OmniRelationEntity.prototype, "targetRecordId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => omni_record_entity_js_1.OmniRecordEntity, (record) => record.incomingRelations),
    (0, typeorm_1.JoinColumn)([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'targetRecordId', referencedColumnName: 'guid' },
    ]),
    tslib_1.__metadata("design:type", Object)
], OmniRelationEntity.prototype, "targetRecord", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    tslib_1.__metadata("design:type", String)
], OmniRelationEntity.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_relation_status_enum_js_1.OmniRelationStatus.Active,
        enum: Object.values(omni_relation_status_enum_js_1.OmniRelationStatus),
        length: 32,
    }),
    tslib_1.__metadata("design:type", String)
], OmniRelationEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniRelationEntity.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    tslib_1.__metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaVersion", void 0);
exports.OmniRelationEntity = OmniRelationEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('omni-relation'),
    (0, typeorm_1.Index)('omni_relation_scope_source_kind_status_created_guid_idx', [
        'scopeId',
        'sourceRecordId',
        'kind',
        'status',
        'createdAt',
        'guid',
    ]),
    (0, typeorm_1.Index)('omni_relation_scope_target_kind_status_created_guid_idx', [
        'scopeId',
        'targetRecordId',
        'kind',
        'status',
        'createdAt',
        'guid',
    ]),
    (0, typeorm_1.Index)('omni_relation_scope_edge_kind_status_unique', ['scopeId', 'sourceRecordId', 'targetRecordId', 'kind', 'status'], { unique: true }),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniRelationEntity);
//# sourceMappingURL=omni-relation.entity.js.map