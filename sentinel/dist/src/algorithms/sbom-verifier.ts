/**
 * # SBOM & Supply Chain Dependency Integrity Guard (`sbom-verifier.ts`)
 * Package SHA-256 cryptographic hash & dependency integrity validator
 * (Academic Ref: *Intelligent Continuous Security*, O'Reilly - Ch. 7).
 */

import * as crypto from 'crypto';

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

export class SbomSupplyChainVerifierEngine {
  public static verifyComponent(record: SbomComponentRecord, actualContent: string | Buffer): { matches: boolean; actualHash: string } {
    const bytes = typeof actualContent === 'string' ? Buffer.from(actualContent) : actualContent;
    const actualHash = crypto.createHash('sha256').update(bytes).digest('hex');

    const matches = actualHash.toLowerCase() === record.expectedSha256.toLowerCase();
    return { matches, actualHash };
  }

  public static auditSupplyChain(
    manifest: SbomComponentRecord[],
    actualComponents: Map<string, string | Buffer>
  ): SupplyChainIntegrityReport {
    const tamperedComponents: string[] = [];
    const revokedComponents: string[] = [];
    let totalVerified = 0;

    for (const record of manifest) {
      if (record.isRevoked) {
        revokedComponents.push(`${record.name}@${record.version}`);
      }

      const content = actualComponents.get(record.name);
      if (content) {
        const { matches } = this.verifyComponent(record, content);
        if (!matches) {
          tamperedComponents.push(`${record.name}@${record.version} (Hash mismatch)`);
        } else {
          totalVerified++;
        }
      } else {
        tamperedComponents.push(`${record.name}@${record.version} (Missing component)`);
      }
    }

    return {
      isValid: tamperedComponents.length === 0 && revokedComponents.length === 0,
      tamperedComponents,
      revokedComponents,
      totalVerified,
    };
  }
}
