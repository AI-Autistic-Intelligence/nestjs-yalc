export interface AuditResult {
    category: string;
    passed: boolean;
    score: number;
    description: string;
    recommendation?: string;
}
export interface KaliAuditReport {
    targetUrl: string;
    timestamp: string;
    nmapScan: {
        openPorts: number[];
        status: string;
    };
    gobusterScan: {
        endpointsFound: string[];
        status: string;
    };
    sqlmapScan: {
        vulnerabilitiesDetected: number;
        status: string;
    };
    commixScan: {
        commandInjectionsDetected: number;
        status: string;
    };
    hydraScan: {
        bruteForceAttempts: number;
        status: string;
    };
    overallVerdict: 'SECURE_PASS' | 'WARN_REVIEW' | 'CRITICAL_FAIL';
}
export declare class FerroxSelfTestEngine {
    runDiagnosticAudit(): {
        results: AuditResult[];
        overallScore: number;
    };
    runKaliRedTeamAudit(targetUrl: string): KaliAuditReport;
}
