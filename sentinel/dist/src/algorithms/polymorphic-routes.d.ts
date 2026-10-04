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
    generateMutatedPath(basePath: string, timestampSecs: number): PolymorphicRouteState;
    validateRequest(requestPath: string, basePath: string, timestampSecs: number): RouteValidationResult;
}
