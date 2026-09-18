"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetrySdkService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const api_logs_1 = require("@opentelemetry/api-logs");
const exporter_logs_otlp_http_1 = require("@opentelemetry/exporter-logs-otlp-http");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_logs_1 = require("@opentelemetry/sdk-logs");
const tokens_js_1 = require("./tokens.js");
let OpenTelemetrySdkService = class OpenTelemetrySdkService {
    constructor(options) {
        this.options = options;
        this.start();
    }
    async onModuleDestroy() {
        if (!this.sdk) {
            return;
        }
        await this.execute(() => this.sdk?.shutdown());
        api_logs_1.logs.disable();
        this.sdk = undefined;
    }
    start() {
        if (!this.options.enabled) {
            return;
        }
        const endpoint = this.options.otlpEndpoint;
        this.sdk = new sdk_node_1.NodeSDK({
            serviceName: this.options.serviceName,
            traceExporter: new exporter_trace_otlp_http_1.OTLPTraceExporter({
                url: `${endpoint}/v1/traces`,
            }),
            metricReaders: [
                new sdk_metrics_1.PeriodicExportingMetricReader({
                    exporter: new exporter_metrics_otlp_http_1.OTLPMetricExporter({
                        url: `${endpoint}/v1/metrics`,
                    }),
                    exportIntervalMillis: this.options.metricExportIntervalMillis,
                }),
            ],
            logRecordProcessors: [
                new sdk_logs_1.SimpleLogRecordProcessor(new exporter_logs_otlp_http_1.OTLPLogExporter({
                    url: `${endpoint}/v1/logs`,
                })),
            ],
        });
        this.execute(() => this.sdk?.start());
    }
    execute(operation) {
        try {
            return operation();
        }
        catch (error) {
            if (this.options.failureMode === 'throw') {
                throw error;
            }
            return undefined;
        }
    }
};
exports.OpenTelemetrySdkService = OpenTelemetrySdkService;
exports.OpenTelemetrySdkService = OpenTelemetrySdkService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(tokens_js_1.OBSERVABILITY_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object])
], OpenTelemetrySdkService);
//# sourceMappingURL=open-telemetry-sdk.service.js.map