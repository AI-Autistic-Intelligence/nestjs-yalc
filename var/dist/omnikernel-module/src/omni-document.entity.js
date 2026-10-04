import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniDocumentKind } from './omni-document-kind.enum.js';
let OmniDocumentEntity = class OmniDocumentEntity extends OmniRecordEntity {
    constructor() {
        super(...arguments);
        this.kind = OmniDocumentKind.Document;
    }
};
__decorate([
    Column({
        type: 'varchar',
        default: OmniDocumentKind.Document,
        enum: Object.values(OmniDocumentKind),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniDocumentEntity.prototype, "documentKind", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "content", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 128 }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "contentMimeType", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true, length: 2048 }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "sourceUrl", void 0);
__decorate([
    Column({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], OmniDocumentEntity.prototype, "publishedAt", void 0);
OmniDocumentEntity = __decorate([
    ChildEntity(OmniDocumentKind.Document),
    ObjectType({ isAbstract: true })
], OmniDocumentEntity);
export { OmniDocumentEntity };
//# sourceMappingURL=omni-document.entity.js.map