"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxSentinelSecurityEngine = void 0;
const index_1 = require("../../../sentinel/dist/index");
class FerroxSentinelSecurityEngine {
    constructor(secretKey = 'ferrox-sentinel-master-key') {
        this.aiGuardrails = index_1.AiPromptGuardrailEngine;
        this.ragScorer = index_1.RagHallucinationGroundednessEngine;
        this.shannonEvaluator = index_1.ShannonEntropyEngine;
        this.routeEngine = new index_1.PolymorphicRouteEngine(secretKey);
        this.markovEngine = new index_1.MarkovBehaviorEngine();
        this.lsassGuard = index_1.LsassCredentialGuardEngine;
        this.sbomVerifier = index_1.SbomSupplyChainVerifierEngine;
    }
    generateSeccompBpfPolicy() {
        return JSON.stringify({
            defaultAction: 'SCMP_ACT_ERRNO',
            architectures: ['SCMP_ARCH_X86_64', 'SCMP_ARCH_AARCH64'],
            syscalls: [
                { name: 'read', action: 'SCMP_ACT_ALLOW' },
                { name: 'write', action: 'SCMP_ACT_ALLOW' },
                { name: 'epoll_wait', action: 'SCMP_ACT_ALLOW' },
                { name: 'execve', action: 'SCMP_ACT_KILL', comment: 'Block zero-day command execution' },
                { name: 'ptrace', action: 'SCMP_ACT_KILL', comment: 'Block memory inspection & process injection' },
                { name: 'kexec_load', action: 'SCMP_ACT_KILL', comment: 'Block kernel payload loading' },
            ],
        }, null, 2);
    }
    generateSysctlHardeningConfig() {
        return [
            '# Ferrox Kernel Hardening Configuration v0.6.0',
            'net.ipv4.tcp_syncookies = 1',
            'net.ipv4.conf.all.rp_filter = 1',
            'kernel.kptr_restrict = 2',
            'kernel.dmesg_restrict = 1',
            'kernel.yama.ptrace_scope = 3',
            'fs.protected_hardlinks = 1',
            'fs.protected_symlinks = 1',
        ].join('\n');
    }
}
exports.FerroxSentinelSecurityEngine = FerroxSentinelSecurityEngine;
//# sourceMappingURL=sentinel-integration.js.map