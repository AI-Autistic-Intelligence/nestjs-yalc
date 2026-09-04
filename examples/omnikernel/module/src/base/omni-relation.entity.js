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
exports.OmniRelationEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_base_entity_js_1 = require("./omni-base.entity.js");
const omni_record_entity_js_1 = require("./omni-record.entity.js");
const omni_relation_status_enum_js_1 = require("../omni-relation-status.enum.js");
let OmniRelationEntity = class OmniRelationEntity extends omni_base_entity_js_1.OmniBaseEntity {
};
exports.OmniRelationEntity = OmniRelationEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "sourceRecordId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => omni_record_entity_js_1.OmniRecordEntity, (record) => record.outgoingRelations),
    (0, typeorm_1.JoinColumn)([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'sourceRecordId', referencedColumnName: 'guid' },
    ]),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "sourceRecord", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "targetRecordId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => omni_record_entity_js_1.OmniRecordEntity, (record) => record.incomingRelations),
    (0, typeorm_1.JoinColumn)([
        { name: 'scopeId', referencedColumnName: 'scopeId' },
        { name: 'targetRecordId', referencedColumnName: 'guid' },
    ]),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "targetRecord", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "kind", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_relation_status_enum_js_1.OmniRelationStatus.Active,
        enum: Object.values(omni_relation_status_enum_js_1.OmniRelationStatus),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniRelationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniRelationEntity.prototype, "payloadSchemaVersion", void 0);
exports.OmniRelationEntity = OmniRelationEntity = __decorate([
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