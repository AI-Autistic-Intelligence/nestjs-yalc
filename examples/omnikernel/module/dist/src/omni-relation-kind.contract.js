"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalOmniRelationKinds = exports.omniRelationKindPattern = void 0;
exports.createOmniRelationKindContract = createOmniRelationKindContract;
const omni_relation_kind_enum_js_1 = require("./omni-relation-kind.enum.js");
exports.omniRelationKindPattern = /^[a-z][a-z0-9_]{0,63}$/;
exports.canonicalOmniRelationKinds = Object.freeze([
    omni_relation_kind_enum_js_1.OmniRelationKind.Contains,
    omni_relation_kind_enum_js_1.OmniRelationKind.References,
    omni_relation_kind_enum_js_1.OmniRelationKind.RelatedTo,
    omni_relation_kind_enum_js_1.OmniRelationKind.DerivedFrom,
]);
function createOmniRelationKindContract(additionalKinds = []) {
    const kinds = new Set(exports.canonicalOmniRelationKinds);
    for (const kind of additionalKinds) {
        if (typeof kind !== 'string' || !exports.omniRelationKindPattern.test(kind)) {
            throw new TypeError('Omni relation kinds must use lowercase letters, digits, and underscores.');
        }
        kinds.add(kind);
    }
    return Object.freeze({
        kinds,
        assert(kind) {
            if (typeof kind !== 'string' || !kinds.has(kind)) {
                throw new TypeError('Omni relation kind is not registered for this module.');
            }
        },
        has(kind) {
            return kinds.has(kind);
        },
    });
}
//# sourceMappingURL=omni-relation-kind.contract.js.map