import { AiPromptGuardrailEngine, RagHallucinationGroundednessEngine, ShannonEntropyEngine, PolymorphicRouteEngine, MarkovBehaviorEngine, LsassCredentialGuardEngine, SbomSupplyChainVerifierEngine } from '../../../sentinel/dist/index';
export declare class FerroxSentinelSecurityEngine {
    aiGuardrails: typeof AiPromptGuardrailEngine;
    ragScorer: typeof RagHallucinationGroundednessEngine;
    shannonEvaluator: typeof ShannonEntropyEngine;
    routeEngine: PolymorphicRouteEngine;
    markovEngine: MarkovBehaviorEngine;
    lsassGuard: typeof LsassCredentialGuardEngine;
    sbomVerifier: typeof SbomSupplyChainVerifierEngine;
    constructor(secretKey?: string);
    generateSeccompBpfPolicy(): string;
    generateSysctlHardeningConfig(): string;
}
