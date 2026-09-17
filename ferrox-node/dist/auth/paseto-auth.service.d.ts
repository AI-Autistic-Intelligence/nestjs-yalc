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
    /**
     * Generates a PASETO v4.local (symmetric encrypted) token
     */
    generateV4LocalToken(payload: PasetoPayload, ttlSeconds?: number): string;
    /**
     * Verifies and decrypts a PASETO v4.local token
     */
    verifyV4LocalToken(token: string): PasetoPayload;
}
