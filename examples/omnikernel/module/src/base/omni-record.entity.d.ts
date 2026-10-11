import type { Relation } from 'typeorm';
import { OmniNamedEntity } from './omni-named.entity.js';
import { OmniRelationEntity } from './omni-relation.entity.js';
import { OmniRecordStatus } from '../omni-record-status.enum.js';
export declare class OmniRecordEntity extends OmniNamedEntity {
    kind: string;
    status: OmniRecordStatus;
    payload?: Record<string, unknown> | null;
    /** Logical schema identity for JSON payload compatibility and migration. */
    payloadSchemaId?: string | null;
    /** Revision of payloadSchemaId; a schema change is explicit metadata. */
    payloadSchemaVersion?: number | null;
    outgoingRelations?: Relation<OmniRelationEntity[]>;
    incomingRelations?: Relation<OmniRelationEntity[]>;
}
