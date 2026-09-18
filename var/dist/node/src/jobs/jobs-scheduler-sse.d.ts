import * as http from 'http';
export interface FerroxJob<T = any> {
    id: string;
    name: string;
    payload: T;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    error?: string;
}
export declare class FerroxJobQueue {
    private queue;
    private handlers;
    registerWorker(jobName: string, handler: (payload: any) => Promise<any>): void;
    enqueue<T>(jobName: string, payload: T): FerroxJob<T>;
    private processNext;
}
export declare class FerroxCronScheduler {
    private tasks;
    scheduleTask(name: string, intervalMs: number, task: () => Promise<void> | void): void;
    stopTask(name: string): void;
}
export declare class FerroxSseStream {
    static initSseResponse(res: http.ServerResponse): void;
    static sendEvent(res: http.ServerResponse, event: string, data: any): void;
}
