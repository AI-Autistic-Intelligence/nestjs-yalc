import { DynamicModule } from '@nestjs/common';
import { type ObservabilityOptions } from './observability-options.js';
export declare class ObservabilityModule {
    static forRoot(options: ObservabilityOptions | (() => ObservabilityOptions)): DynamicModule;
}
export declare class OpenTelemetryEventManagerPluginModule {
    static forRoot(options: ObservabilityOptions | (() => ObservabilityOptions)): DynamicModule;
}
