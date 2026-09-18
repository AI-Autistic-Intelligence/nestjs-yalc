"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniNamedEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_base_entity_js_1 = require("./omni-base.entity.js");
let OmniNamedEntity = class OmniNamedEntity extends omni_base_entity_js_1.OmniBaseEntity {
};
exports.OmniNamedEntity = OmniNamedEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    tslib_1.__metadata("design:type", Object)
], OmniNamedEntity.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    tslib_1.__metadata("design:type", String)
], OmniNamedEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    tslib_1.__metadata("design:type", Object)
], OmniNamedEntity.prototype, "slug", void 0);
exports.OmniNamedEntity = OmniNamedEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('omni-named'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniNamedEntity);
//# sourceMappingURL=omni-named.entity.js.map