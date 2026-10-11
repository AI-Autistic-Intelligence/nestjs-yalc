import { OmniRelationStatus } from './omni-relation-status.enum.js';
export interface OmniRelationProjectionAliases {
    /** Public field that maps to OmniRelationEntity.kind. */
    kind?: string;
    /** Public field that maps to OmniRelationEntity.sourceRecordId. */
    source?: string;
    /** Public field that maps to OmniRelationEntity.targetRecordId. */
    target?: string;
    /** Public field that maps to OmniRelationEntity.payload. */
    payload?: string;
}
export interface OmniRelationProjectionDefinition {
    id: string;
    relation: {
        /**
         * Legacy single-kind shorthand. New multi-kind resources use
         * allowedKinds instead.
         */
        kind?: string;
        /** The non-empty registered kinds this one generated resource permits. */
        allowedKinds?: readonly string[];
        sourceKind: string;
        targetKind: string;
        status?: OmniRelationStatus;
        schema?: {
            id: string;
            version: number;
        };
    };
    /** Names exposed by generated REST and GraphQL transports. */
    aliases?: OmniRelationProjectionAliases;
}
/** Resolves legacy kind syntax into the canonical immutable allowed-kind set. */
export declare function getOmniRelationProjectionAllowedKinds(definition: OmniRelationProjectionDefinition): readonly string[];
/** Resolves omitted aliases to the native OmniRelationEntity field names. */
export declare function getOmniRelationProjectionAliases(definition: OmniRelationProjectionDefinition): Required<OmniRelationProjectionAliases>;
/**
 * Defines one generated relation resource over omni-relation. A resource can
 * expose one or more registered relation kinds, while status, schema, and
 * endpoint kinds remain server-owned.
 */
export declare function defineOmniRelationProjection<TDefinition extends OmniRelationProjectionDefinition>(definition: TDefinition): Readonly<TDefinition>;
