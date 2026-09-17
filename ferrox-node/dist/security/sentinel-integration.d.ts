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
    /**
     * Generates Linux Seccomp BPF policy for server kernel sandboxing
     */
    generateSeccompBpfPolicy(): string;
    /**
     * Generates Linux kernel sysctl security hardening configuration
     */
    generateSysctlHardeningConfig(): string;
}
