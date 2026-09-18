export interface PasetoPayload {
    sub: string;
    roles?: string[];
    exp?: number;
    iat?: number;
    iss?: string;
    [key: string]: any;
}
export declare class PasetoAuthService {
    private secretKey;
    private issuer;
    constructor(secretKeyString?: string, issuer?: string);
    generateV4LocalToken(payload: PasetoPayload, ttlSeconds?: number): string;
    verifyV4LocalToken(token: string): PasetoPayload;
}
