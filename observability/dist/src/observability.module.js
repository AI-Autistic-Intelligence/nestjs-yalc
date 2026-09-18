"use strict";
var ObservabilityModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryEventManagerPluginModule = exports.ObservabilityModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const observability_options_js_1 = require("./observability-options.js");
const tokens_js_1 = require("./tokens.js");
const open_telemetry_sdk_service_js_1 = require("./open-telemetry-sdk.service.js");
const telemetry_service_js_1 = require("./telemetry.service.js");
const opentelemetry_event_manager_plugin_js_1 = require("./event-manager/opentelemetry-event-manager.plugin.js");
let ObservabilityModule = ObservabilityModule_1 = class ObservabilityModule {
    static forRoot(options) {
        const providers = [
            {
                provide: tokens_js_1.OBSERVABILITY_OPTIONS,
                useFactory: () => (0, observability_options_js_1.normalizeObservabilityOptions)(typeof options === 'function' ? options() : options),
            },
            open_telemetry_sdk_service_js_1.OpenTelemetrySdkService,
            telemetry_service_js_1.TelemetryService,
            opentelemetry_event_manager_plugin_js_1.OpenTelemetryEventManagerPlugin,
        ];
        return {
            module: ObservabilityModule_1,
            providers,
            exports: [tokens_js_1.OBSERVABILITY_OPTIONS, telemetry_service_js_1.TelemetryService],
        };
    }
};
exports.ObservabilityModule = ObservabilityModule;
exports.ObservabilityModule = ObservabilityModule = ObservabilityModule_1 = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], ObservabilityModule);
let OpenTelemetryEventManagerPluginModule = class OpenTelemetryEventManagerPluginModule {
    static forRoot(options) {
        return ObservabilityModule.forRoot(options);
    }
};
exports.OpenTelemetryEventManagerPluginModule = OpenTelemetryEventManagerPluginModule;
exports.OpenTelemetryEventManagerPluginModule = OpenTelemetryEventManagerPluginModule = tslib_1.__decorate([
    (0, common_1.Module)({})
], OpenTelemetryEventManagerPluginModule);
//# sourceMappingURL=observability.module.js.map