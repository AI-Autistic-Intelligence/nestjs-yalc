"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedOmniRelation = exports.isCanonicalCollectionMembershipRelation = exports.isOmniDocumentRecordKind = exports.isOmniCollectionRecordKind = exports.OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND = void 0;
const omni_collection_kind_enum_js_1 = require("./omni-collection-kind.enum.js");
const omni_document_kind_enum_js_1 = require("./omni-document-kind.enum.js");
const omni_relation_kind_enum_js_1 = require("./omni-relation-kind.enum.js");
exports.OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND = omni_relation_kind_enum_js_1.OmniRelationKind.Contains;
const hasKind = (kind) => kind.trim().length > 0;
const isOmniCollectionRecordKind = (kind) => kind === omni_collection_kind_enum_js_1.OmniCollectionKind.Collection;
exports.isOmniCollectionRecordKind = isOmniCollectionRecordKind;
const isOmniDocumentRecordKind = (kind) => kind === omni_document_kind_enum_js_1.OmniDocumentKind.Document;
exports.isOmniDocumentRecordKind = isOmniDocumentRecordKind;
const isCanonicalCollectionMembershipRelation = ({ sourceKind, relationKind, }) => relationKind === exports.OMNI_COLLECTION_MEMBERSHIP_RELATION_KIND &&
    (0, exports.isOmniCollectionRecordKind)(sourceKind);
exports.isCanonicalCollectionMembershipRelation = isCanonicalCollectionMembershipRelation;
const isAllowedOmniRelation = ({ sourceKind, targetKind, relationKind, }) => {
    if (!hasKind(sourceKind) || !hasKind(targetKind)) {
        return false;
    }
    switch (relationKind) {
        case omni_relation_kind_enum_js_1.OmniRelationKind.Contains:
            return (0, exports.isOmniCollectionRecordKind)(sourceKind);
        case omni_relation_kind_enum_js_1.OmniRelationKind.DerivedFrom:
            return ((0, exports.isOmniDocumentRecordKind)(sourceKind) &&
                (0, exports.isOmniDocumentRecordKind)(targetKind));
        case omni_relation_kind_enum_js_1.OmniRelationKind.References:
        case omni_relation_kind_enum_js_1.OmniRelationKind.RelatedTo:
            return true;
        default:
            return false;
    }
};
exports.isAllowedOmniRelation = isAllowedOmniRelation;
//# sourceMappingURL=omni-relation-semantics.js.map