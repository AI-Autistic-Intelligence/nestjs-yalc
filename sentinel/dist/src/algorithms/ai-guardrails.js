"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPromptGuardrailEngine = exports.AiPromptThreatLevel = void 0;
var AiPromptThreatLevel;
(function (AiPromptThreatLevel) {
    AiPromptThreatLevel["Benign"] = "Benign";
    AiPromptThreatLevel["SuspiciousPattern"] = "SuspiciousPattern";
    AiPromptThreatLevel["DirectPromptInjection"] = "DirectPromptInjection";
    AiPromptThreatLevel["SystemPromptExfiltration"] = "SystemPromptExfiltration";
    AiPromptThreatLevel["DanJailbreak"] = "DanJailbreak";
})(AiPromptThreatLevel || (exports.AiPromptThreatLevel = AiPromptThreatLevel = {}));
class AiPromptGuardrailEngine {
    static { this.INJECTION_KEYWORDS = [
        'ignore previous instructions',
        'system:',
        '[admin_override]',
        'you are now dan',
        'reveal system prompt',
        'override role',
        'developer mode enabled',
    ]; }
    static evaluatePrompt(rawPrompt) {
        const promptLower = rawPrompt.toLowerCase();
        const matchedKeywords = [];
        let threatScore = 0.0;
        for (const kw of this.INJECTION_KEYWORDS) {
            if (promptLower.includes(kw)) {
                matchedKeywords.push(kw);
                threatScore += 0.35;
            }
        }
        let sanitizedPrompt = rawPrompt
            .replace(/<\|im_start\|>/gi, '')
            .replace(/<\|im_end\|>/gi, '')
            .replace(/<\|system\|>/gi, '')
            .replace(/Ignore previous instructions/gi, '[REDACTED_INSTRUCTION]');
        let threatLevel = AiPromptThreatLevel.Benign;
        if (threatScore >= 0.7) {
            threatLevel = AiPromptThreatLevel.DanJailbreak;
        }
        else if (threatScore >= 0.35) {
            threatLevel = AiPromptThreatLevel.DirectPromptInjection;
        }
        else if (matchedKeywords.length > 0) {
            threatLevel = AiPromptThreatLevel.SuspiciousPattern;
        }
        return {
            isThreatDetected: threatScore >= 0.35,
            threatLevel,
            sanitizedPrompt,
            threatScore: Math.min(1.0, threatScore),
            matchedKeywords,
        };
    }
}
exports.AiPromptGuardrailEngine = AiPromptGuardrailEngine;
//# sourceMappingURL=ai-guardrails.js.map