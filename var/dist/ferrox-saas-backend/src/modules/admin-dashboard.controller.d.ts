export declare class AdminDashboardController {
    private selfTestEngine;
    private sandboxEngine;
    constructor();
    getAdminDashboardHtml(): string;
    runSelfTest(): any;
    runKaliAudit(req: any): any;
    getKernelSandboxPolicy(): {
        seccompBpf: any;
        landlockLsm: any;
    };
    getKernelSysctlConfig(): {
        sysctlConfig: any;
    };
}
