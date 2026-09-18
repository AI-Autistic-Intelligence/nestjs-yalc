"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationKind = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniRelationKind;
(function (OmniRelationKind) {
    OmniRelationKind["Contains"] = "contains";
    OmniRelationKind["References"] = "references";
    OmniRelationKind["RelatedTo"] = "related_to";
    OmniRelationKind["DerivedFrom"] = "derived_from";
})(OmniRelationKind || (exports.OmniRelationKind = OmniRelationKind = {}));
(0, graphql_1.registerEnumType)(OmniRelationKind, {
    name: 'OmniRelationKind',
});
//# sourceMappingURL=omni-relation-kind.enum.js.map