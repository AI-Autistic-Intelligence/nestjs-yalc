/**
 * # AI Prompt Guardrail & Injection Sanitizer (`ai-guardrails.ts`)
 * Direct/indirect prompt injection, ChatML delimiter stripping & DAN jailbreak detection
 * (Academic Ref: *Red Teaming AI*, O'Reilly).
 */

export enum AiPromptThreatLevel {
  Benign = 'Benign',
  SuspiciousPattern = 'SuspiciousPattern',
  DirectPromptInjection = 'DirectPromptInjection',
  SystemPromptExfiltration = 'SystemPromptExfiltration',
  DanJailbreak = 'DanJailbreak',
}

export interface AiGuardrailAssessment {
  isThreatDetected: boolean;
  threatLevel: AiPromptThreatLevel;
  sanitizedPrompt: string;
  threatScore: number;
  matchedKeywords: string[];
}

export class AiPromptGuardrailEngine {
  private static readonly INJECTION_KEYWORDS = [
    'ignore previous instructions',
    'system:',
    '[admin_override]',
    'you are now dan',
    'reveal system prompt',
    'override role',
    'developer mode enabled',
  ];

  /**
   * Evaluates input prompt for prompt injection patterns and strips harmful ChatML tags
   */
  public static evaluatePrompt(rawPrompt: string): AiGuardrailAssessment {
    const promptLower = rawPrompt.toLowerCase();
    const matchedKeywords: string[] = [];
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
    } else if (threatScore >= 0.35) {
      threatLevel = AiPromptThreatLevel.DirectPromptInjection;
    } else if (matchedKeywords.length > 0) {
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
