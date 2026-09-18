"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniDocumentEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_document_kind_enum_js_1 = require("./omni-document-kind.enum.js");
let OmniDocumentEntity = class OmniDocumentEntity extends omni_record_entity_js_1.OmniRecordEntity {
    constructor() {
        super(...arguments);
        this.kind = omni_document_kind_enum_js_1.OmniDocumentKind.Document;
    }
};
exports.OmniDocumentEntity = OmniDocumentEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_document_kind_enum_js_1.OmniDocumentKind.Document,
        enum: Object.values(omni_document_kind_enum_js_1.OmniDocumentKind),
        length: 32,
    }),
    tslib_1.__metadata("design:type", String)
], OmniDocumentEntity.prototype, "documentKind", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentEntity.prototype, "content", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentEntity.prototype, "contentMimeType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 2048 }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentEntity.prototype, "sourceUrl", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OmniDocumentEntity.prototype, "publishedAt", void 0);
exports.OmniDocumentEntity = OmniDocumentEntity = tslib_1.__decorate([
    (0, typeorm_1.ChildEntity)(omni_document_kind_enum_js_1.OmniDocumentKind.Document),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniDocumentEntity);
//# sourceMappingURL=omni-document.entity.js.map