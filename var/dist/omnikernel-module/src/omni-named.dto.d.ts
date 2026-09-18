import { OmniNamedEntity } from './base/omni-named.entity.js';
export declare class OmniNamedType extends OmniNamedEntity {
    constructor(data?: Partial<OmniNamedType>);
    guid: string;
    revision: number;
    externalId?: string | null;
    title: string;
    slug?: string | null;
}
declare const OmniNamedCreateInput_base: import("@nestjs/common").Type<Omit<OmniNamedType, "createdAt" | "updatedAt" | "revision">>;
export declare class OmniNamedCreateInput extends OmniNamedCreateInput_base {
}
declare const OmniNamedCondition_base: import("@nestjs/common").Type<Partial<OmniNamedCreateInput>>;
export declare class OmniNamedCondition extends OmniNamedCondition_base {
}
declare const OmniNamedUpdateInput_base: import("@nestjs/common").Type<Partial<OmniNamedCreateInput>>;
export declare class OmniNamedUpdateInput extends OmniNamedUpdateInput_base {
}
export {};
