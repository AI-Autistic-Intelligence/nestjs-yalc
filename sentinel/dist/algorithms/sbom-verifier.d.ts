/**
 * # SBOM & Supply Chain Dependency Integrity Guard (`sbom-verifier.ts`)
 * Package SHA-256 cryptographic hash & dependency integrity validator
 * (Academic Ref: *Intelligent Continuous Security*, O'Reilly - Ch. 7).
 */
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
