export interface OmniScope {
    readonly scopeId: string;
    cacheKey(key: string): string;
}
export type OmniScopeResolver = (request: unknown) => string | undefined;
export interface OmniKernelRegistrationOptions {
    dbConnection: string;
    /**
     * Authentication adapters resolve a trusted server scope from the request.
     * The adapter owns authentication; OmniKernel never reads a client DTO field.
     */
    resolveScope?: OmniScopeResolver;
    /**
     * Compatibility/default partition for applications that do not yet have an
     * authentication adapter. It is server configuration, never request input.
     */
    defaultScopeId?: string;
    /** Kinds exclusively owned by registered extension projections. */
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
/**
 * Request-scoped server context used by every Omni generated API and loader.
 * It is intentionally unavailable when neither the trusted adapter nor a
 * configured default provides a scope.
 */
export declare class OmniScopeContext implements OmniScope {
    readonly scopeId: string;
    constructor(request: unknown, options: ReturnType<typeof normalizeOmniKernelRegistrationOptions>);
    cacheKey(key: string): string;
}
