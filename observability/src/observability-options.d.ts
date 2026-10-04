export type ObservabilityFailureMode = 'ignore' | 'throw';
export interface ObservabilityEventManagerOptions {
    enabled?: boolean;
    listenTo?: string[];
    ignore?: string[];
}
export interface ObservabilityPayloadOptions {
    include?: boolean;
    maxSize?: number;
    mask?: string[];
}
export interface ObservabilityOptions {
    enabled?: boolean;
    serviceName: string;
    otlpEndpoint?: string;
    eventManager?: ObservabilityEventManagerOptions;
    payload?: ObservabilityPayloadOptions;
    failureMode?: ObservabilityFailureMode;
    metricExportIntervalMillis?: number;
}
export interface NormalizedObservabilityOptions {
    enabled: boolean;
    serviceName: string;
    otlpEndpoint: string;
    eventManager: Required<ObservabilityEventManagerOptions>;
    payload: Required<ObservabilityPayloadOptions>;
    failureMode: ObservabilityFailureMode;
    metricExportIntervalMillis: number;
}
export declare function normalizeObservabilityOptions(options: ObservabilityOptions): NormalizedObservabilityOptions;
export declare function createObservabilityOptionsFromEnv(serviceName: string): ObservabilityOptions;
