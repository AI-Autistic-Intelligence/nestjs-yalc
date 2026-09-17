# `@nest-yalc-2/sentinel` (@ferrox/node)

> **Ferrox-Node Sentinel**: High-performance AI/ML Security Analytics, Prompt Injection Sanitizer, RAG Groundedness Scorer, Shannon Payload Entropy Evaluator, Markov Sequence Anomaly Detector, LSASS Process Telemetry, and Cryptographic SBOM Verification for NestJS.

Ported from the 35 State-of-the-Art (SOTA) Literature Innovations across 11 technical security & AI books, `@nest-yalc-2/sentinel` brings enterprise Ferrox kernel protection to Node.js and TypeScript ecosystems.

## 🌟 Features & Innovations

1. **AI Prompt Injection & Jailbreak Guardrails (`AiPromptGuardrailEngine`)**:
   - Detects direct/indirect prompt injections (`system prompt override`, `ignore previous instructions`).
   - Strips ChatML tags (`<|im_start|>`, `<|im_end|>`) and DAN jailbreak patterns.
   - Restricts system prompt override attacks.

2. **RAG Groundedness & Hallucination Scoring (`RagGroundednessScorer`)**:
   - Computes claim overlap ratio: $S_{\text{grounded}} = \frac{|\text{facts} \cap \text{context}|}{|\text{facts}|}$.
   - Prevents ungrounded LLM responses from reaching end-users.

3. **Shannon Entropy Payload Analysis (`ShannonEntropyEvaluator`)**:
   - Computes $H(X) = -\sum P(x_i) \log_2 P(x_i)$ over incoming request buffers.
   - Detects encrypted / shellcode / high-entropy malicious payloads ($H(X) \ge 7.2$ bits/byte).

4. **Polymorphic Time-Windowed HMAC Route Rotation (`PolymorphicRouteMutator`)**:
   - Generates rotating endpoint hashes $H = \text{HMAC-SHA256}(K, \text{Path} \parallel T_{\text{window}})$.
   - Defeats static endpoint scanning and automated bot enumeration.

5. **Markov Sequence Anomaly Prediction (`MarkovSequenceAnalyzer`)**:
   - Maintains transition probability matrices $P(S_{t+1} \mid S_t)$ for user navigation state sequences.
   - Flags suspicious out-of-order execution paths in API usage.

6. **LSASS Process Handle Telemetry (`LsassGuardTelemetry`)**:
   - Inspects process access rights (`PROCESS_VM_READ` `0x0010`, `PROCESS_VM_WRITE` `0x0020`, `PROCESS_ALL_ACCESS` `0x1F0FFF`).
   - Triggers high-priority security events upon credential dumping attempts.

7. **Cryptographic Software Bill of Materials Verification (`SbomCryptographicVerifier`)**:
   - Computes and verifies SHA-256 integrity hashes for loaded application dependencies against SBOM manifests.

## 🚀 Installation & Usage

### 1. Register Module in NestJS Application

```typescript
import { Module } from '@nestjs/common';
import { FerroxSentinelModule } from '@nest-yalc-2/sentinel';

@Module({
  imports: [
    FerroxSentinelModule.forRoot({
      aiGuardrails: true,
      ragGroundedness: true,
      shannonEntropy: true,
      entropyThreshold: 7.2,
      groundednessThreshold: 0.7,
    }),
  ],
})
export class AppModule {}
```

### 2. Apply Guard & Interceptor

```typescript
import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { FerroxSentinelGuard, FerroxSentinelInterceptor } from '@nest-yalc-2/sentinel';

@Controller('ai')
@UseGuards(FerroxSentinelGuard)
@UseInterceptors(FerroxSentinelInterceptor)
export class AiController {
  @Post('query')
  async handleQuery(@Body('prompt') prompt: string) {
    return { result: 'Response from secure LLM backend' };
  }
}
```

## 🧪 Testing

```bash
npm run test -- --testPathPatterns="sentinel.spec"
```

## 📜 License

MIT © Ferrox Security & AI Autistic Intelligence Team
