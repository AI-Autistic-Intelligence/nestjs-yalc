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
exports.OmniExternalRefEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_base_entity_js_1 = require("./omni-base.entity.js");
const omni_external_ref_internal_type_enum_js_1 = require("../omni-external-ref-internal-type.enum.js");
let OmniExternalRefEntity = class OmniExternalRefEntity extends omni_base_entity_js_1.OmniBaseEntity {
};
exports.OmniExternalRefEntity = OmniExternalRefEntity;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: Object.values(omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType),
        length: 64,
    }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "internalType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: '', length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: '', length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "container", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OmniExternalRefEntity.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payloadSchemaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], OmniExternalRefEntity.prototype, "payloadSchemaVersion", void 0);
exports.OmniExternalRefEntity = OmniExternalRefEntity = __decorate([
    (0, typeorm_1.Entity)('omni-external-ref'),
    (0, typeorm_1.Index)('omni_external_ref_scope_external_identity_unique', ['scopeId', 'provider', 'account', 'container', 'externalId'], { unique: true }),
    (0, typeorm_1.Index)('omni_external_ref_scope_internal_lookup_idx', [
        'scopeId',
        'internalType',
        'internalId',
        'provider',
        'guid',
    ]),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniExternalRefEntity);
//# sourceMappingURL=omni-external-ref.entity.js.map