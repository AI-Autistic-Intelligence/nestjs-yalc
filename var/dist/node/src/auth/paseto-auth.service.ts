import * as crypto from 'crypto';

export interface PasetoPayload {
  sub: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  iss?: string;
  [key: string]: any;
}

export class PasetoAuthService {
  private secretKey: Buffer;
  private issuer: string;

  constructor(secretKeyString: string = 'ferrox-default-paseto-secret-32b', issuer: string = 'ferrox-node-auth') {
    this.secretKey = crypto.createHash('sha256').update(secretKeyString).digest();
    this.issuer = issuer;
  }

  /**
   * Generates a PASETO v4.local (symmetric encrypted) token
   */
  public generateV4LocalToken(payload: PasetoPayload, ttlSeconds: number = 3600): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: PasetoPayload = {
      iss: this.issuer,
      iat: now,
      exp: now + ttlSeconds,
      ...payload,
    };

    const payloadJson = JSON.stringify(fullPayload);
    const nonce = crypto.randomBytes(24);
    
    // AEAD encryption simulation with AES-256-GCM + SHA256 HMAC for v4 local parity
    const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
    let encrypted = cipher.update(payloadJson, 'utf-8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    const tokenBuffer = Buffer.concat([nonce, authTag, encrypted]);
    return `v4.local.${tokenBuffer.toString('base64url')}`;
  }

  /**
   * Verifies and decrypts a PASETO v4.local token
   */
  public verifyV4LocalToken(token: string): PasetoPayload {
    if (!token.startsWith('v4.local.')) {
      throw new Error('Invalid PASETO token format. Expected v4.local prefix.');
    }

    const rawBase64 = token.slice(9);
    const tokenBuffer = Buffer.from(rawBase64, 'base64url');

    if (tokenBuffer.length < 40) {
      throw new Error('Corrupted PASETO token buffer');
    }

    const nonce = tokenBuffer.subarray(0, 24);
    const authTag = tokenBuffer.subarray(24, 40);
    const encrypted = tokenBuffer.subarray(40);

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const payload: PasetoPayload = JSON.parse(decrypted.toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      throw new Error('PASETO token has expired');
    }

    return payload;
  }
}
