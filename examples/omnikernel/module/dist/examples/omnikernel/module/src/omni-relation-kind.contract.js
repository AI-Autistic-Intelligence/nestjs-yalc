import { OmniRelationKind } from './omni-relation-kind.enum.js';
export const omniRelationKindPattern = /^[a-z][a-z0-9_]{0,63}$/;
export const canonicalOmniRelationKinds = Object.freeze([
    OmniRelationKind.Contains,
    OmniRelationKind.References,
    OmniRelationKind.RelatedTo,
    OmniRelationKind.DerivedFrom,
]);
export function createOmniRelationKindContract(additionalKinds = []) {
    const kinds = new Set(canonicalOmniRelationKinds);
    for (const kind of additionalKinds) {
        if (typeof kind !== 'string' || !omniRelationKindPattern.test(kind)) {
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