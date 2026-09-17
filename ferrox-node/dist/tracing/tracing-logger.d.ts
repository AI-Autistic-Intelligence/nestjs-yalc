export interface TraceContext {
    traceId: string;
    spanId: string;
    sampled: boolean;
}
export declare class TracingEngine {
    static createTraceContext(): TraceContext;
    static parseTraceparent(header?: string): TraceContext;
    static formatTraceparent(ctx: TraceContext): string;
}
export declare class FerroxLogger {
    private serviceName;
    constructor(serviceName?: string);
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, meta?: Record<string, any>): void;
    private log;
}
