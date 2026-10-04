import { OmniCollectionKind } from './omni-collection-kind.enum.js';
import { OmniDocumentKind } from './omni-document-kind.enum.js';
import { OmniRelationKind } from './omni-relation-kind.enum.js';
export const OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND = OmniRelationKind.Contains;
const hasKind = (kind) => kind.trim().length > 0;
export const isOmniCollectionRecordKind = (kind) => kind === OmniCollectionKind.Collection;
export const isOmniDocumentRecordKind = (kind) => kind === OmniDocumentKind.Document;
export const isCanonicalCollectionMembershipRelation = ({ sourceKind, relationKind, }) => relationKind === OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND &&
    isOmniCollectionRecordKind(sourceKind);
export const isAllowedOmniRelation = ({ sourceKind, targetKind, relationKind, }) => {
    if (!hasKind(sourceKind) || !hasKind(targetKind)) {
        return false;
    }
    switch (relationKind) {
        case OmniRelationKind.Contains:
            return isOmniCollectionRecordKind(sourceKind);
        case OmniRelationKind.DerivedFrom:
            return (isOmniDocumentRecordKind(sourceKind) &&
                isOmniDocumentRecordKind(targetKind));
        case OmniRelationKind.References:
        case OmniRelationKind.RelatedTo:
            return true;
        default:
            return false;
    }
};
//# sourceMappingURL=omni-relation-semantics.js.map