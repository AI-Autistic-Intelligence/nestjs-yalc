import type { Relation } from 'typeorm';
import { OmniNamedEntity } from './omni-named.entity.js';
import { OmniRelationEntity } from './omni-relation.entity.js';
import { OmniRecordStatus } from '../omni-record-status.enum.js';
export declare class OmniRecordEntity extends OmniNamedEntity {
    kind: string;
    status: OmniRecordStatus;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
    outgoingRelations?: Relation<OmniRelationEntity[]>;
    incomingRelations?: Relation<OmniRelationEntity[]>;
}
