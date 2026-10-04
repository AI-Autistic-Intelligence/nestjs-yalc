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
    static evaluatePrompt(rawPrompt: string): AiGuardrailAssessment;
}
