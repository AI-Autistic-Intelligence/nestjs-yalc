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
exports.OmniRecordEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_named_entity_js_1 = require("./omni-named.entity.js");
const omni_relation_entity_js_1 = require("./omni-relation.entity.js");
const omni_record_status_enum_js_1 = require("../omni-record-status.enum.js");
let OmniRecordEntity = class OmniRecordEntity extends omni_named_entity_js_1.OmniNamedEntity {
};
exports.OmniRecordEntity = OmniRecordEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], OmniRecordEntity.prototype, "kind", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_record_status_enum_js_1.OmniRecordStatus.Draft,
        enum: Object.values(omni_record_status_enum_js_1.OmniRecordStatus),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniRecordEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "payloadSchemaVersion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => omni_relation_entity_js_1.OmniRelationEntity, (relation) => relation.sourceRecord),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "outgoingRelations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => omni_relation_entity_js_1.OmniRelationEntity, (relation) => relation.targetRecord),
    __metadata("design:type", Object)
], OmniRecordEntity.prototype, "incomingRelations", void 0);
exports.OmniRecordEntity = OmniRecordEntity = __decorate([
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