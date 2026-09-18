import { type Attributes } from '@opentelemetry/api';
import type { IEventPayload } from '@node-yalc/event-manager/event';
import type { NormalizedObservabilityOptions } from './observability-options.js';
export interface TelemetryRecordOptions {
    attributes?: Record<string, unknown>;
}
export declare class TelemetryService {
    private readonly options;
    private readonly tracer;
    private readonly meter;
    private readonly logger;
    private readonly eventCounter;
    private readonly errorCounter;
    private readonly durationHistogram;
    constructor(options: NormalizedObservabilityOptions);
    get enabled(): boolean;
    measure<T>(name: string, operation: () => T | Promise<T>, attributes?: Record<string, unknown>): T | Promise<T>;
    recordYalcEvent(eventName: string, payload?: IEventPayload): void;
    recordDuration(name: string, durationMs: number, attributes?: Record<string, unknown>): void;
    private measureWithSpan;
    private finishSpan;
    private failSpan;
    private buildEventAttributes;
    private emitLogRecord;
    private execute;
}
export declare function toTelemetryAttributes(attributes?: Record<string, unknown>): Attributes;
