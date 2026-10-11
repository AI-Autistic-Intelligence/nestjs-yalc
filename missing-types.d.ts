declare module 'typeorm-model-generator/dist/src/Engine' {
  export function createModelFromDatabase(driver: any, connectionOptions: any, generationOptions: any): Promise<any>;
  export function createDriver(driverName: string): any;
}
declare module 'typeorm-model-generator/dist/src/IConnectionOptions' {
  export function getDefaultConnectionOptions(): Record<string, any>;
  export default interface IConnectionOptions { [key: string]: any }
}
declare module 'typeorm-model-generator/dist/src/IGenerationOptions' {
  export function getDefaultGenerationOptions(): Record<string, any>;
}
declare module '@opentelemetry/api' {
  export const trace: any;
  export const metrics: any;
  export const context: any;
  export const SpanStatusCode: any;
  export interface Span { 
    [key: string]: any; 
    setStatus(status: any): void; 
    end(): void; 
    recordException(e: any): void; 
  }
  export interface Attributes { [key: string]: any }
}
declare module '@opentelemetry/api-logs' {
  export const logs: any;
  export enum SeverityNumber {
    TRACE = 1,
    DEBUG = 5,
    INFO = 9,
    WARN = 13,
    ERROR = 17,
    FATAL = 21,
  }
}
declare module '@opentelemetry/exporter-logs-otlp-http' {
  export class OTLPLogExporter { constructor(options?: any); }
}
declare module '@opentelemetry/exporter-metrics-otlp-http' {
  export class OTLPMetricExporter { constructor(options?: any); }
}
declare module '@opentelemetry/exporter-trace-otlp-http' {
  export class OTLPTraceExporter { constructor(options?: any); }
}
declare module '@opentelemetry/sdk-metrics' {
  export class PeriodicExportingMetricReader { constructor(options?: any); }
}
declare module '@opentelemetry/sdk-node' {
  export class NodeSDK { constructor(options?: any); start(): void; shutdown(): Promise<void>; }
}
declare module '@opentelemetry/sdk-logs' {
  export class SimpleLogRecordProcessor { constructor(exporter?: any); }
}
