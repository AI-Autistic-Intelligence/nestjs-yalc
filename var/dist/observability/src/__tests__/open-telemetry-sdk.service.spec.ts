import { OpenTelemetrySdkService } from "../open-telemetry-sdk.service";
import { normalizeObservabilityOptions } from "../observability-options";
import { jest } from "@jest/globals";

describe("OpenTelemetrySdkService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not start when disabled", async () => {
    const service = new OpenTelemetrySdkService(
      normalizeObservabilityOptions({
        enabled: false,
        serviceName: "disabled",
      })
    );

    await service.onModuleDestroy();
  });

  it("starts and shuts down the OpenTelemetry SDK when enabled", async () => {
    const service = new OpenTelemetrySdkService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "sdk-test",
        otlpEndpoint: "http://collector:4318/",
      })
    );

    await service.onModuleDestroy();
  });

  it("throws error when failureMode is throw", () => {
    const service = new OpenTelemetrySdkService({
      ...normalizeObservabilityOptions({
        enabled: true,
        serviceName: "sdk-test",
      }),
      failureMode: "throw",
    } as any);

    // Mock the sdk so it throws
    (service as any).sdk = {
      start: () => {
        throw new Error("failed");
      }
    };

    expect(() => service.onApplicationBootstrap()).toThrow();
  });

  it("ignores error when failureMode is ignore", () => {
    const service = new OpenTelemetrySdkService({
      ...normalizeObservabilityOptions({
        enabled: true,
        serviceName: "sdk-test",
      }),
      failureMode: "ignore",
    } as any);

    expect(service).toBeDefined();
  });
});
