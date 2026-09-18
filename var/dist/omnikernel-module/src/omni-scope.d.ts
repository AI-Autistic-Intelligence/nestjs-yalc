export interface OmniScope {
    readonly scopeId: string;
    cacheKey(key: string): string;
}
export type OmniScopeResolver = (request: unknown) => string | undefined;
export interface OmniKernelRegistrationOptions {
    dbConnection: string;
    resolveScope?: OmniScopeResolver;
    defaultScopeId?: string;
    reservedRecordKinds?: readonly string[];
    relationKinds?: readonly string[];
    deletion?: Partial<OmniDeletionPolicies>;
}
export type OmniDeletePolicy = 'hard' | 'tombstone';
export interface OmniDeletionPolicies {
    named: OmniDeletePolicy;
    record: OmniDeletePolicy;
    document: OmniDeletePolicy;
    collection: OmniDeletePolicy;
    relation: OmniDeletePolicy;
    externalRef: OmniDeletePolicy;
}
export declare const OMNI_KERNEL_OPTIONS: unique symbol;
export declare const defaultOmniDeletionPolicies: OmniDeletionPolicies;
export declare function normalizeOmniKernelRegistrationOptions(options: string | OmniKernelRegistrationOptions): Required<Pick<OmniKernelRegistrationOptions, 'dbConnection' | 'defaultScopeId' | 'relationKinds'>> & Omit<OmniKernelRegistrationOptions, 'dbConnection' | 'defaultScopeId' | 'relationKinds' | 'reservedRecordKinds' | 'deletion'> & {
    reservedRecordKinds: readonly string[];
    deletion: OmniDeletionPolicies;
};
export declare class OmniScopeContext implements OmniScope {
    readonly scopeId: string;
    constructor(request: unknown, options: ReturnType<typeof normalizeOmniKernelRegistrationOptions>);
    cacheKey(key: string): string;
}
