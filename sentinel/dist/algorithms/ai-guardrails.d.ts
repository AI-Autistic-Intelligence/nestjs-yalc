/**
 * # AI Prompt Guardrail & Injection Sanitizer (`ai-guardrails.ts`)
 * Direct/indirect prompt injection, ChatML delimiter stripping & DAN jailbreak detection
 * (Academic Ref: *Red Teaming AI*, O'Reilly).
 */
export declare enum AiPromptThreatLevel {
    Benign = "Benign",
    SuspiciousPattern = "SuspiciousPattern",
    DirectPromptInjection = "DirectPromptInjection",
    SystemPromptExfiltration = "SystemPromptExfiltration",
    DanJailbreak = "DanJailbreak"
}
export interface AiGuardrailAssessment {
    isThreatDetected: boolean;
    threatLevel: AiPromptThreatLevel;
    sanitizedPrompt: string;
    threatScore: number;
    matchedKeywords: string[];
}
export declare class AiPromptGuardrailEngine {
    private static readonly INJECTION_KEYWORDS;
    /**
     * Evaluates input prompt for prompt injection patterns and strips harmful ChatML tags
     */
    static evaluatePrompt(rawPrompt: string): AiGuardrailAssessment;
}
