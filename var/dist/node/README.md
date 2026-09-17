# `@ferrox/node`

> **Ferrox-Node**: High-performance, Standalone Enterprise Security & Web Framework for Node.js / TypeScript. Built-in Dual Fastify & Express Engine Adapters, PASETO v4 Security, TOTP 2FA, Mandatory Kernel Compliance Guards, and Sentinel AI/LSM Guardrails.

`@ferrox/node` is the complete Node.js/TypeScript port of the Rust **Ferrox** kernel & security ecosystem (`ferrox-backend`). It operates as a standalone framework without requiring external web framework dependencies.

## 🌟 Key Features

1. **Dual HTTP Engines (Fastify & Express)**:
   - Switch seamlessly between Fastify for high-performance schema-validated HTTP/2 and Express for classic middleware ecosystems.

2. **PASETO v4 Token Authentication**:
   - `v4.local` (symmetric AEAD token encryption) and `v4.public` (asymmetric ed25519 token signatures), replacing legacy JWTs with cryptographically secure PASETO.

3. **TOTP 2FA Authentication**:
   - Built-in time-based one-time password secret generation, QR code URI formatting, and windowed token validation.

4. **Mandatory Compliance Guard**:
   - Enforces strict security response headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Content-Security-Policy`), payload integrity checks, and PASETO verification.

5. **Sentinel AI & Kernel LSM Guardrails**:
   - AI prompt injection guardrails, ChatML tag stripping, RAG hallucination scoring, Shannon payload entropy evaluation, Markov sequence anomaly prediction, LSASS process handle telemetry, cryptographic SBOM verification, Seccomp BPF & Landlock LSM policy generation, and kernel sysctl hardener.

## 🚀 Quick Start

```typescript
import { FerroxApp, Controller, Get, Post, UseGuard, MandatoryComplianceGuard } from '@ferrox/node';

@Controller('/api/v1')
@UseGuard(new MandatoryComplianceGuard())
export class ApiController {
  @Get('/status')
  getStatus() {
    return { status: 'UP', framework: 'Ferrox-Node v0.6.0' };
  }
}

const app = new FerroxApp({
  engine: 'fastify', // or 'express'
  port: 8080,
  controllers: [new ApiController()],
});

app.start();
```

## 📜 License

MIT © Ferrox Security & AI Autistic Intelligence Team
