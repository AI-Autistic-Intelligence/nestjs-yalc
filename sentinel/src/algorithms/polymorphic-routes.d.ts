/**
 * # Polymorphic API Route Mutation Engine (`polymorphic-routes.ts`)
 * Ephemeral time-windowed HMAC path rotation for endpoint obfuscation
 * (Academic Ref: *ACM SIGCOMM*).
 */
export interface PolymorphicRouteState {
    basePath: string;
    currentMutatedPath: string;
    windowSlot: number;
    expiresInSecs: number;
}
export interface RouteValidationResult {
    isValid: boolean;
    basePath: string;
    windowSlot: number;
}
export declare class PolymorphicRouteEngine {
    private secretKey;
    private rotationPeriodSecs;
    constructor(secretKey: string | Buffer, rotationPeriodSecs?: number);
    /**
     * Generates the current mutated path for a given base path and timestamp
     */
    generateMutatedPath(basePath: string, timestampSecs: number): PolymorphicRouteState;
    /**
     * Validates incoming request path against current and previous window slot
     */
    validateRequest(requestPath: string, basePath: string, timestampSecs: number): RouteValidationResult;
}
