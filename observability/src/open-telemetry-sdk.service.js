import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { OBSERVABILITY_OPTIONS } from './tokens.js';
let OTLPLogExporter;
let OTLPMetricExporter;
let OTLPTraceExporter;
let PeriodicExportingMetricReader;
let NodeSDK;
let SimpleLogRecordProcessor;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ NodeSDK } = require('@opentelemetry/sdk-node'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs'));
}
catch {
    // Optional exporter dependencies not installed in test or lightweight runner
}
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
        try {
            logs.disable();
        }
        catch { }
        this.sdk = undefined;
    }
    start() {
        if (!this.options.enabled || !NodeSDK) {
            return;
        }
        const endpoint = this.options.otlpEndpoint;
        this.sdk = new NodeSDK({
            serviceName: this.options.serviceName,
            traceExporter: OTLPTraceExporter
                ? new OTLPTraceExporter({
                    url: `${endpoint}/v1/traces`,
                })
                : undefined,
            metricReaders: PeriodicExportingMetricReader && OTLPMetricExporter
                ? [
                    new PeriodicExportingMetricReader({
                        exporter: new OTLPMetricExporter({
                            url: `${endpoint}/v1/metrics`,
                        }),
                        exportIntervalMillis: this.options.metricExportIntervalMillis,
                    }),
                ]
                : [],
            logRecordProcessors: SimpleLogRecordProcessor && OTLPLogExporter
                ? [
                    new SimpleLogRecordProcessor({
                        exporter: new OTLPLogExporter({
                            url: `${endpoint}/v1/logs`,
                        }),
                    }),
                ]
                : [],
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
OpenTelemetrySdkService = __decorate([
    Injectable(),
    __param(0, Inject(OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], OpenTelemetrySdkService);
export { OpenTelemetrySdkService };
//# sourceMappingURL=open-telemetry-sdk.service.js.map