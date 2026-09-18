export declare class AdminController {
    getUsers(): {
        id: string;
        email: string;
        role: string;
    }[];
    getAuditLogs(): {
        id: string;
        event: string;
        ip: string;
        timestamp: string;
    }[];
}
