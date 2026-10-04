import { registerEnumType } from '@nestjs/graphql';
export var OmniRelationKind;
(function (OmniRelationKind) {
    OmniRelationKind["Contains"] = "contains";
    OmniRelationKind["References"] = "references";
    OmniRelationKind["RelatedTo"] = "related_to";
    OmniRelationKind["DerivedFrom"] = "derived_from";
})(OmniRelationKind || (OmniRelationKind = {}));
registerEnumType(OmniRelationKind, {
    name: 'OmniRelationKind',
});
//# sourceMappingURL=omni-relation-kind.enum.js.map