/**
 * # Polymorphic API Route Mutation Engine (`polymorphic-routes.ts`)
 * Ephemeral time-windowed HMAC path rotation for endpoint obfuscation
 * (Academic Ref: *ACM SIGCOMM*).
 */

import * as crypto from 'crypto';

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

export class PolymorphicRouteEngine {
  private secretKey: Buffer;
  private rotationPeriodSecs: number;

  constructor(secretKey: string | Buffer, rotationPeriodSecs: number = 300) {
    this.secretKey = typeof secretKey === 'string' ? Buffer.from(secretKey) : secretKey;
    this.rotationPeriodSecs = rotationPeriodSecs;
  }

  /**
   * Generates the current mutated path for a given base path and timestamp
   */
  public generateMutatedPath(basePath: string, timestampSecs: number): PolymorphicRouteState {
    const windowSlot = Math.floor(timestampSecs / this.rotationPeriodSecs);
    const hasher = crypto.createHash('sha256');
    hasher.update(this.secretKey);
    hasher.update(basePath);

    const slotBuf = Buffer.alloc(8);
    slotBuf.writeBigUInt64BE(BigInt(windowSlot));
    hasher.update(slotBuf);

    const hexHash = hasher.digest('hex').substring(0, 16);
    const currentMutatedPath = `${basePath}/_poly_${hexHash}`;
    const expiresInSecs = this.rotationPeriodSecs - (timestampSecs % this.rotationPeriodSecs);

    return {
      basePath,
      currentMutatedPath,
      windowSlot,
      expiresInSecs,
    };
  }

  /**
   * Validates incoming request path against current and previous window slot
   */
  public validateRequest(requestPath: string, basePath: string, timestampSecs: number): RouteValidationResult {
    const currentSlot = Math.floor(timestampSecs / this.rotationPeriodSecs);

    for (const slot of [currentSlot, Math.max(0, currentSlot - 1)]) {
      const hasher = crypto.createHash('sha256');
      hasher.update(this.secretKey);
      hasher.update(basePath);

      const slotBuf = Buffer.alloc(8);
      slotBuf.writeBigUInt64BE(BigInt(slot));
      hasher.update(slotBuf);

      const hexHash = hasher.digest('hex').substring(0, 16);
      const expectedPath = `${basePath}/_poly_${hexHash}`;

      if (requestPath === expectedPath) {
        return {
          isValid: true,
          basePath,
          windowSlot: slot,
        };
      }
    }

    return {
      isValid: false,
      basePath,
      windowSlot: currentSlot,
    };
  }
}
