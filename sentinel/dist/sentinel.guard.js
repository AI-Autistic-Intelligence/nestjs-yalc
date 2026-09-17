"use strict";
/**
 * # NestJS Ferrox-Node Sentinel Guard (`sentinel.guard.ts`)
 * CanActivate Guard evaluating entropy, prompt injection, and velocity anomalies
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxSentinelGuard = void 0;
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
exports.FerroxSentinelGuard = FerroxSentinelGuard = __decorate([
    (0, common_1.Injectable)()
], FerroxSentinelGuard);
