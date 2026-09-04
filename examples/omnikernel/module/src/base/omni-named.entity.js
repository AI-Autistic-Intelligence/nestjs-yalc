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
exports.OmniNamedEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_base_entity_js_1 = require("./omni-base.entity.js");
let OmniNamedEntity = class OmniNamedEntity extends omni_base_entity_js_1.OmniBaseEntity {
};
exports.OmniNamedEntity = OmniNamedEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniNamedEntity.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OmniNamedEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", Object)
], OmniNamedEntity.prototype, "slug", void 0);
exports.OmniNamedEntity = OmniNamedEntity = __decorate([
    (0, typeorm_1.Entity)('omni-named'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniNamedEntity);
//# sourceMappingURL=omni-named.entity.js.map