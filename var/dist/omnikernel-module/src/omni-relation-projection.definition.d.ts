import { OmniRelationStatus } from './omni-relation-status.enum.js';
export interface OmniRelationProjectionAliases {
    kind?: string;
    source?: string;
    target?: string;
    payload?: string;
}
export interface OmniRelationProjectionDefinition {
    id: string;
    relation: {
        kind?: string;
        allowedKinds?: readonly string[];
        sourceKind: string;
        targetKind: string;
        status?: OmniRelationStatus;
        schema?: {
            id: string;
            version: number;
        };
    };
    aliases?: OmniRelationProjectionAliases;
}
export declare function getOmniRelationProjectionAllowedKinds(definition: OmniRelationProjectionDefinition): readonly string[];
export declare function getOmniRelationProjectionAliases(definition: OmniRelationProjectionDefinition): Required<OmniRelationProjectionAliases>;
export declare function defineOmniRelationProjection<TDefinition extends OmniRelationProjectionDefinition>(definition: TDefinition): Readonly<TDefinition>;
