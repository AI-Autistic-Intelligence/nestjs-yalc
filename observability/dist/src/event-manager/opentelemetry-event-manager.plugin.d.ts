import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { YalcEventService } from '@nest-yalc-2/event-manager';
import type { NormalizedObservabilityOptions } from '../observability-options.js';
import { TelemetryService } from '../telemetry.service.js';
export declare class OpenTelemetryEventManagerPlugin implements OnModuleInit, OnModuleDestroy {
    private readonly events;
    private readonly telemetry;
    private readonly options;
    private readonly listener;
    constructor(events: YalcEventService, telemetry: TelemetryService, options: NormalizedObservabilityOptions);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private handleEvent;
    private shouldRecord;
    private matchesAny;
}
export declare function matchesEventPattern(eventName: string, pattern: string): boolean;
