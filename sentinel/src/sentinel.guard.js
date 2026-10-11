"use strict";
/**
 * # NestJS Ferrox-Node Sentinel Guard (`sentinel.guard.ts`)
 * CanActivate Guard evaluating entropy, prompt injection, and velocity anomalies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxSentinelGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const ai_guardrails_js_1 = require("./algorithms/ai-guardrails.js");
const shannon_entropy_js_1 = require("./algorithms/shannon-entropy.js");
let FerroxSentinelGuard = class FerroxSentinelGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const bodyStr = request.body ? JSON.stringify(request.body) : '';
        // 1. Evaluate Payload Shannon Entropy
        const entropyResult = shannon_entropy_js_1.ShannonEntropyEngine.calculateEntropy(bodyStr);
        if (entropyResult.isSuspicious) {
            throw new common_1.ForbiddenException(`[FerroxSentinel] Blocked high-entropy payload (Score: ${entropyResult.entropyScore})`);
        }
        // 2. Evaluate Prompt Injection Patterns if string present in query or body
        const promptSample = `${request.url} ${bodyStr}`;
        const aiAssessment = ai_guardrails_js_1.AiPromptGuardrailEngine.evaluatePrompt(promptSample);
        if (aiAssessment.isThreatDetected && aiAssessment.threatScore >= 0.7) {
            throw new common_1.ForbiddenException(`[FerroxSentinel] Blocked Prompt Injection / DAN Jailbreak attempt. Matched: ${aiAssessment.matchedKeywords.join(', ')}`);
        }
        return true;
    }
};
exports.FerroxSentinelGuard = FerroxSentinelGuard;
exports.FerroxSentinelGuard = FerroxSentinelGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], FerroxSentinelGuard);
//# sourceMappingURL=sentinel.guard.js.map