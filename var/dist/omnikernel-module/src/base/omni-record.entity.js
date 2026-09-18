"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRecordEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_named_entity_js_1 = require("./omni-named.entity.js");
const omni_relation_entity_js_1 = require("./omni-relation.entity.js");
const omni_record_status_enum_js_1 = require("../omni-record-status.enum.js");
let OmniRecordEntity = class OmniRecordEntity extends omni_named_entity_js_1.OmniNamedEntity {
};
exports.OmniRecordEntity = OmniRecordEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    tslib_1.__metadata("design:type", String)
], OmniRecordEntity.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_record_status_enum_js_1.OmniRecordStatus.Draft,
        enum: Object.values(omni_record_status_enum_js_1.OmniRecordStatus),
        length: 32,
    }),
    tslib_1.__metadata("design:type", String)
], OmniRecordEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniRecordEntity.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    tslib_1.__metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaVersion", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => omni_relation_entity_js_1.OmniRelationEntity, (relation) => relation.sourceRecord),
    tslib_1.__metadata("design:type", Object)
], OmniRecordEntity.prototype, "outgoingRelations", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => omni_relation_entity_js_1.OmniRelationEntity, (relation) => relation.targetRecord),
    tslib_1.__metadata("design:type", Object)
], OmniRecordEntity.prototype, "incomingRelations", void 0);
exports.OmniRecordEntity = OmniRecordEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('omni-record'),
    (0, typeorm_1.Index)('omni_record_scope_kind_status_guid_idx', [
        'scopeId',
        'kind',
        'status',
        'guid',
    ]),
    (0, typeorm_1.TableInheritance)({
        column: {
            name: 'recordType',
            type: 'varchar',
            length: 32,
        },
    }),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniRecordEntity);
//# sourceMappingURL=omni-record.entity.js.map