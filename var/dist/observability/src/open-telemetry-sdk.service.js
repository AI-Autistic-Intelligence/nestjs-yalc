import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OBSERVABILITY_OPTIONS } from './tokens.js';
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
        logs.disable();
        this.sdk = undefined;
    }
    start() {
        if (!this.options.enabled) {
            return;
        }
        const endpoint = this.options.otlpEndpoint;
        this.sdk = new NodeSDK({
            serviceName: this.options.serviceName,
            traceExporter: new OTLPTraceExporter({
                url: `${endpoint}/v1/traces`,
            }),
            metricReaders: [
                new PeriodicExportingMetricReader({
                    exporter: new OTLPMetricExporter({
                        url: `${endpoint}/v1/metrics`,
                    }),
                    exportIntervalMillis: this.options.metricExportIntervalMillis,
                }),
            ],
            logRecordProcessors: [
                new SimpleLogRecordProcessor(new OTLPLogExporter({
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
OpenTelemetrySdkService = __decorate([
    Injectable(),
    __param(0, Inject(OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], OpenTelemetrySdkService);
export { OpenTelemetrySdkService };
//# sourceMappingURL=open-telemetry-sdk.service.js.map