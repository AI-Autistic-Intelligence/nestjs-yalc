export declare class AdminDashboardController {
    private selfTestEngine;
    private sandboxEngine;
    constructor();
    getAdminDashboardHtml(): string;
    runSelfTest(): {
        results: import("../../../../ferrox-node/dist/index").AuditResult[];
        overallScore: number;
    };
    runKaliAudit(req: any): import("../../../../ferrox-node/dist/index").KaliAuditReport;
    getKernelSandboxPolicy(): {
        seccompBpf: any;
        landlockLsm: any;
    };
    getKernelSysctlConfig(): {
        sysctlConfig: string;
    };
}
