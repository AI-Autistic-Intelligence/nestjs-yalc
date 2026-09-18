import type { Relation } from 'typeorm';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import { OmniCollectionKind } from './omni-collection-kind.enum.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
import { OmniRelationType } from './omni-relation.dto.js';
export declare class OmniCollectionType extends OmniCollectionEntity {
    constructor(data?: Partial<OmniCollectionType>);
    guid: string;
    revision: number;
    externalId?: string | null;
    title: string;
    slug?: string | null;
    kind: OmniCollectionKind;
    status: OmniRecordStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
    outgoingRelations?: Relation<OmniRelationType[]>;
    incomingRelations?: Relation<OmniRelationType[]>;
    collectionKind: OmniCollectionKind;
    summary?: string | null;
}
declare const OmniCollectionCreateInput_base: import("@nestjs/common").Type<Omit<OmniCollectionType, "revision" | "createdAt" | "updatedAt" | "kind" | "outgoingRelations" | "incomingRelations">>;
export declare class OmniCollectionCreateInput extends OmniCollectionCreateInput_base {
}
declare const OmniCollectionCondition_base: import("@nestjs/common").Type<Partial<OmniCollectionCreateInput>>;
export declare class OmniCollectionCondition extends OmniCollectionCondition_base {
}
declare const OmniCollectionUpdateInput_base: import("@nestjs/common").Type<Partial<OmniCollectionCreateInput>>;
export declare class OmniCollectionUpdateInput extends OmniCollectionUpdateInput_base {
}
export {};
