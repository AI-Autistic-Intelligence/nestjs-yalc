"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniCollectionEntity = void 0;
const tslib_1 = require("tslib");
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
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_collection_kind_enum_js_1.OmniCollectionKind.Collection,
        enum: Object.values(omni_collection_kind_enum_js_1.OmniCollectionKind),
        length: 32,
    }),
    tslib_1.__metadata("design:type", String)
], OmniCollectionEntity.prototype, "collectionKind", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniCollectionEntity.prototype, "summary", void 0);
exports.OmniCollectionEntity = OmniCollectionEntity = tslib_1.__decorate([
    (0, typeorm_1.ChildEntity)(omni_collection_kind_enum_js_1.OmniCollectionKind.Collection),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniCollectionEntity);
//# sourceMappingURL=omni-collection.entity.js.map