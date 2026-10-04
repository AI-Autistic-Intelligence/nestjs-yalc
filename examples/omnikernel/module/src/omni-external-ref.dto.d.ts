import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
export declare class OmniExternalRefType extends OmniExternalRefEntity {
    constructor(data?: Partial<OmniExternalRefType>);
    guid: string;
    revision: number;
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
declare const OmniExternalRefCreateInput_base: import("@nestjs/common").Type<Omit<OmniExternalRefType, "revision" | "createdAt" | "updatedAt">>;
export declare class OmniExternalRefCreateInput extends OmniExternalRefCreateInput_base {
}
declare const OmniExternalRefCondition_base: import("@nestjs/common").Type<Partial<OmniExternalRefCreateInput>>;
export declare class OmniExternalRefCondition extends OmniExternalRefCondition_base {
}
declare const OmniExternalRefUpdateInput_base: import("@nestjs/common").Type<Partial<OmniExternalRefCreateInput>>;
export declare class OmniExternalRefUpdateInput extends OmniExternalRefUpdateInput_base {
}
export {};
