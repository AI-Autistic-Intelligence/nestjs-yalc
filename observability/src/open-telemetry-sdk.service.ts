import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { OBSERVABILITY_OPTIONS } from './tokens.js';
import type { NormalizedObservabilityOptions } from './observability-options.js';

let OTLPLogExporter: any;
let OTLPMetricExporter: any;
let OTLPTraceExporter: any;
let PeriodicExportingMetricReader: any;
let NodeSDK: any;
let SimpleLogRecordProcessor: any;

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
} catch {
  // Optional exporter dependencies not installed in test or lightweight runner
}

@Injectable()
export class OpenTelemetrySdkService implements OnModuleDestroy {
  private sdk?: any | undefined;

  constructor(
    @Inject(OBSERVABILITY_OPTIONS)
    private readonly options: NormalizedObservabilityOptions,
  ) {
    this.start();
  }

  async onModuleDestroy() {
    if (!this.sdk) {
      return;
    }

    await this.execute(() => this.sdk?.shutdown());
    try {
      logs.disable();
    } catch {}
    this.sdk = undefined;
  }

  private start() {
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
              }) as any,
            } as any),
          ]
        : [],
    });

    this.execute(() => this.sdk?.start());
  }

  private execute<T>(operation: () => T): T | undefined {
    try {
      return operation();
    } catch (error) {
      if (this.options.failureMode === 'throw') {
        throw error;
      }

      return undefined;
    }
  }
}
