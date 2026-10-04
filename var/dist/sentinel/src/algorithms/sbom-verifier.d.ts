export interface SbomComponentRecord {
    name: string;
    version: string;
    expectedSha256: string;
    isRevoked: boolean;
}
export interface SupplyChainIntegrityReport {
    isValid: boolean;
    tamperedComponents: string[];
    revokedComponents: string[];
    totalVerified: number;
}
export declare class SbomSupplyChainVerifierEngine {
    static verifyComponent(record: SbomComponentRecord, actualContent: string | Buffer): {
        matches: boolean;
        actualHash: string;
    };
    static auditSupplyChain(manifest: SbomComponentRecord[], actualComponents: Map<string, string | Buffer>): SupplyChainIntegrityReport;
}
