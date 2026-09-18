import { OmniBaseEntity } from './omni-base.entity.js';
import { OmniExternalRefInternalType } from '../omni-external-ref-internal-type.enum.js';
export declare class OmniExternalRefEntity extends OmniBaseEntity {
    internalType: OmniExternalRefInternalType;
    internalId: string;
    provider: string;
    account?: string | null;
    container?: string | null;
    externalId: string;
    payload?: Record<string, unknown> | null;
    payloadSchemaId?: string | null;
    payloadSchemaVersion?: number | null;
}
