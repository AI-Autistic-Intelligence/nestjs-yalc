/**
 * # NestJS Ferrox-Node Sentinel Guard (`sentinel.guard.ts`)
 * CanActivate Guard evaluating entropy, prompt injection, and velocity anomalies
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AiPromptGuardrailEngine } from './algorithms/ai-guardrails.js';
import { ShannonEntropyEngine } from './algorithms/shannon-entropy.js';

@Injectable()
export class FerroxSentinelGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const bodyStr = request.body ? JSON.stringify(request.body) : '';

    // 1. Evaluate Payload Shannon Entropy
    const entropyResult = ShannonEntropyEngine.calculateEntropy(bodyStr);
    if (entropyResult.isSuspicious) {
      throw new ForbiddenException(`[FerroxSentinel] Blocked high-entropy payload (Score: ${entropyResult.entropyScore})`);
    }

    // 2. Evaluate Prompt Injection Patterns if string present in query or body
    const promptSample = `${request.url} ${bodyStr}`;
    const aiAssessment = AiPromptGuardrailEngine.evaluatePrompt(promptSample);

    if (aiAssessment.isThreatDetected && aiAssessment.threatScore >= 0.7) {
      throw new ForbiddenException(
        `[FerroxSentinel] Blocked Prompt Injection / DAN Jailbreak attempt. Matched: ${aiAssessment.matchedKeywords.join(', ')}`
      );
    }

    return true;
  }
}
