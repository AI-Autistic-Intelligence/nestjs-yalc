export declare class TotpAuthService {
    /**
     * Generates a 32-character base32-encoded TOTP secret
     */
    generateSecret(): string;
    /**
     * Formats an otpauth URI for TOTP QR Code generation
     */
    generateOtpAuthUri(label: string, secret: string, issuer?: string): string;
    /**
     * Validates a 6-digit TOTP code for a given secret within a time window
     */
    verifyTotpCode(secret: string, code: string, window?: number): boolean;
    private generateCodeForStep;
}
