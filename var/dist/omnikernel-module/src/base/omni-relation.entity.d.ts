import type { Relation } from 'typeorm';
import { OmniBaseEntity } from './omni-base.entity.js';
import { OmniRecordEntity } from './omni-record.entity.js';
import { OmniRelationStatus } from '../omni-relation-status.enum.js';
export declare class OmniRelationEntity extends OmniBaseEntity {
    sourceRecordId: string;
    sourceRecord: Relation<OmniRecordEntity>;
    targetRecordId: string;
    targetRecord: Relation<OmniRecordEntity>;
    kind: string;
    status: OmniRelationStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
}
