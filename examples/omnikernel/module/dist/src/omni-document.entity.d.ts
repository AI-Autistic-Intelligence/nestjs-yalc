import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniDocumentKind } from './omni-document-kind.enum.js';
export declare class OmniDocumentEntity extends OmniRecordEntity {
    kind: OmniDocumentKind;
    documentKind: OmniDocumentKind;
    content?: string | null;
    contentMimeType?: string | null;
    sourceUrl?: string | null;
    publishedAt?: Date | null;
}
