export declare class TotpAuthService {
    generateSecret(): string;
    generateOtpAuthUri(label: string, secret: string, issuer?: string): string;
    verifyTotpCode(secret: string, code: string, window?: number): boolean;
    private generateCodeForStep;
}
