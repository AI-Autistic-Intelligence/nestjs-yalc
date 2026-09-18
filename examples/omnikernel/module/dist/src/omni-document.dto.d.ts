import type { Relation } from 'typeorm';
import { OmniDocumentEntity } from './omni-document.entity.js';
import { OmniDocumentKind } from './omni-document-kind.enum.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
import { OmniRelationType } from './omni-relation.dto.js';
export declare class OmniDocumentType extends OmniDocumentEntity {
    constructor(data?: Partial<OmniDocumentType>);
    guid: string;
    revision: number;
    externalId?: string | null;
    title: string;
    slug?: string | null;
    kind: OmniDocumentKind;
    status: OmniRecordStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
    outgoingRelations?: Relation<OmniRelationType[]>;
    incomingRelations?: Relation<OmniRelationType[]>;
    documentKind: OmniDocumentKind;
    content?: string | null;
    contentMimeType?: string | null;
    sourceUrl?: string | null;
    publishedAt?: Date | null;
}
declare const OmniDocumentCreateInput_base: import("@nestjs/common").Type<Omit<OmniDocumentType, "createdAt" | "updatedAt" | "revision" | "kind" | "outgoingRelations" | "incomingRelations">>;
export declare class OmniDocumentCreateInput extends OmniDocumentCreateInput_base {
}
declare const OmniDocumentCondition_base: import("@nestjs/common").Type<Partial<OmniDocumentCreateInput>>;
export declare class OmniDocumentCondition extends OmniDocumentCondition_base {
}
declare const OmniDocumentUpdateInput_base: import("@nestjs/common").Type<Partial<OmniDocumentCreateInput>>;
export declare class OmniDocumentUpdateInput extends OmniDocumentUpdateInput_base {
}
export {};
