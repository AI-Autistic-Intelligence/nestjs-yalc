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
exports.OmniDocumentEntity = void 0;
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
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: omni_document_kind_enum_js_1.OmniDocumentKind.Document,
        enum: Object.values(omni_document_kind_enum_js_1.OmniDocumentKind),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniDocumentEntity.prototype, "documentKind", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "contentMimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 2048 }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "sourceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "publishedAt", void 0);
exports.OmniDocumentEntity = OmniDocumentEntity = __decorate([
    (0, typeorm_1.ChildEntity)(omni_document_kind_enum_js_1.OmniDocumentKind.Document),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], OmniDocumentEntity);
//# sourceMappingURL=omni-document.entity.js.map