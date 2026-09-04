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
exports.OmniCollectionEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_collection_kind_enum_js_1 = require("./omni-collection-kind.enum.js");
let OmniCollectionEntity = class OmniCollectionEntity extends omni_record_entity_js_1.OmniRecordEntity {
    constructor() {
        super(...arguments);
        this.kind = omni_collection_kind_enum_js_1.OmniCollectionKind.Collection;
    }
};
exports.OmniCollectionEntity = OmniCollectionEntity;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_collection_kind_enum_js_1.OmniCollectionKind.Collection,
        enum: Object.values(omni_collection_kind_enum_js_1.OmniCollectionKind),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniCollectionEntity.prototype, "collectionKind", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OmniCollectionEntity.prototype, "summary", void 0);
exports.OmniCollectionEntity = OmniCollectionEntity = __decorate([
    (0, typeorm_1.ChildEntity)(omni_collection_kind_enum_js_1.OmniCollectionKind.Collection),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniCollectionEntity);
//# sourceMappingURL=omni-collection.entity.js.map