import type { Relation } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationType } from './omni-relation.dto.js';
import { OmniRecordStatus } from './omni-record-status.enum.js';
export declare class OmniRecordType extends OmniRecordEntity {
    constructor(data?: Partial<OmniRecordType>);
    guid: string;
    revision: number;
    externalId?: string | null;
    title: string;
    slug?: string | null;
    kind: string;
    status: OmniRecordStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
    outgoingRelations?: Relation<OmniRelationType[]>;
    incomingRelations?: Relation<OmniRelationType[]>;
}
declare const OmniRecordCreateInput_base: import("@nestjs/common").Type<Omit<OmniRecordType, "revision" | "createdAt" | "updatedAt" | "outgoingRelations" | "incomingRelations">>;
export declare class OmniRecordCreateInput extends OmniRecordCreateInput_base {
}
declare const OmniRecordCondition_base: import("@nestjs/common").Type<Partial<OmniRecordCreateInput>>;
export declare class OmniRecordCondition extends OmniRecordCondition_base {
}
declare const OmniRecordUpdateInput_base: import("@nestjs/common").Type<Partial<OmniRecordCreateInput>>;
export declare class OmniRecordUpdateInput extends OmniRecordUpdateInput_base {
}
export {};
