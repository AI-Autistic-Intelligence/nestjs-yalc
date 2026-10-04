var ObservabilityModule_1;
import { __decorate } from "tslib";
import { Global, Module } from '@nestjs/common';
import { normalizeObservabilityOptions, } from './observability-options.js';
import { OBSERVABILITY_OPTIONS } from './tokens.js';
import { OpenTelemetrySdkService } from './open-telemetry-sdk.service.js';
import { TelemetryService } from './telemetry.service.js';
import { OpenTelemetryEventManagerPlugin } from './event-manager/opentelemetry-event-manager.plugin.js';
let ObservabilityModule = ObservabilityModule_1 = class ObservabilityModule {
    static forRoot(options) {
        const providers = [
            {
                provide: OBSERVABILITY_OPTIONS,
                useFactory: () => normalizeObservabilityOptions(typeof options === 'function' ? options() : options),
            },
            OpenTelemetrySdkService,
            TelemetryService,
            OpenTelemetryEventManagerPlugin,
        ];
        return {
            module: ObservabilityModule_1,
            providers,
            exports: [OBSERVABILITY_OPTIONS, TelemetryService],
        };
    }
};
ObservabilityModule = ObservabilityModule_1 = __decorate([
    Global(),
    Module({})
], ObservabilityModule);
export { ObservabilityModule };
let OpenTelemetryEventManagerPluginModule = class OpenTelemetryEventManagerPluginModule {
    static forRoot(options) {
        return ObservabilityModule.forRoot(options);
    }
};
OpenTelemetryEventManagerPluginModule = __decorate([
    Module({})
], OpenTelemetryEventManagerPluginModule);
export { OpenTelemetryEventManagerPluginModule };
//# sourceMappingURL=observability.module.js.map