import { OmniRelationKind } from './omni-relation-kind.enum.js';
export interface OmniRelationSemanticsInput {
    sourceKind: string;
    targetKind: string;
    relationKind: string;
}
export declare const OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND = OmniRelationKind.Contains;
export declare const isOmniCollectionRecordKind: (kind: string) => boolean;
export declare const isOmniDocumentRecordKind: (kind: string) => boolean;
export declare const isCanonicalCollectionMembershipRelation: ({ sourceKind, relationKind, }: Pick<OmniRelationSemanticsInput, "sourceKind" | "relationKind">) => boolean;
export declare const isAllowedOmniRelation: ({ sourceKind, targetKind, relationKind, }: OmniRelationSemanticsInput) => boolean;
