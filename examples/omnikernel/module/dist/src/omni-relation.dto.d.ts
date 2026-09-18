import type { Relation } from 'typeorm';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniRecordType } from './omni-record.dto.js';
import { OmniRelationStatus } from './omni-relation-status.enum.js';
export declare class OmniRelationType extends OmniRelationEntity {
    constructor(data?: Partial<OmniRelationType>);
    guid: string;
    revision: number;
    sourceRecordId: string;
    sourceRecord: Relation<OmniRecordType>;
    targetRecordId: string;
    targetRecord: Relation<OmniRecordType>;
    kind: string;
    status: OmniRelationStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
}
declare const OmniRelationCreateInput_base: import("@nestjs/common").Type<Omit<OmniRelationType, "createdAt" | "updatedAt" | "revision" | "sourceRecord" | "targetRecord">>;
export declare class OmniRelationCreateInput extends OmniRelationCreateInput_base {
}
declare const OmniRelationCondition_base: import("@nestjs/common").Type<Partial<OmniRelationCreateInput>>;
export declare class OmniRelationCondition extends OmniRelationCondition_base {
}
declare const OmniRelationUpdateInput_base: import("@nestjs/common").Type<Partial<OmniRelationCreateInput>>;
export declare class OmniRelationUpdateInput extends OmniRelationUpdateInput_base {
}
export {};
