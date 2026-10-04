import { OmniRelationKind } from './omni-relation-kind.enum.js';
export declare const omniRelationKindPattern: RegExp;
export declare const canonicalOmniRelationKinds: readonly [OmniRelationKind.Contains, OmniRelationKind.References, OmniRelationKind.RelatedTo, OmniRelationKind.DerivedFrom];
export interface OmniRelationKindContract {
    readonly kinds: ReadonlySet<string>;
    assert(kind: unknown): asserts kind is string;
    has(kind: string): boolean;
}
export declare function createOmniRelationKindContract(additionalKinds?: readonly string[]): OmniRelationKindContract;
