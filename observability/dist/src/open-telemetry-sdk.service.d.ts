import { OnModuleDestroy } from '@nestjs/common';
import type { NormalizedObservabilityOptions } from './observability-options.js';
export declare class OpenTelemetrySdkService implements OnModuleDestroy {
    private readonly options;
    private sdk?;
    constructor(options: NormalizedObservabilityOptions);
    onModuleDestroy(): Promise<void>;
    private start;
    private execute;
}
