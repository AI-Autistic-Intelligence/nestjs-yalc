import {
  TelemetryService,
  toTelemetryAttributes,
} from "../telemetry.service";
import { normalizeObservabilityOptions } from "../observability-options.js";
import { jest } from "@jest/globals";
import { logs } from "@opentelemetry/api-logs";
import { trace } from "@opentelemetry/api";

describe("TelemetryService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("runs operations without telemetry when disabled", async () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: false,
        serviceName: "test",
      })
    );

    await expect(
      service.measure("test.operation", async () => "ok")
    ).resolves.toBe("ok");
  });

  it("records successful async operations when enabled", async () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    await expect(
      service.measure("test.operation", async () => "ok")
    ).resolves.toBe("ok");
  });

  it("records failed operations", async () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    await expect(
      service.measure("test.failure", async () => {
        throw new Error("failed");
      })
    ).rejects.toThrow("failed");
  });

  it("records successful synchronous operations", () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    expect(service.measure("test.operation", () => "ok")).toBe("ok");
  });

  it("records failed synchronous operations", () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    expect(() =>
      service.measure("test.failure", () => {
        throw new Error("failed");
      })
    ).toThrow("failed");
  });

  it("records event payloads with masked data", () => {
    const emit = jest.fn();
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        payload: {
          include: true,
          mask: ["token"],
        },
      })
    );

    service.recordYalcEvent("task.created", {
      eventName: "task.created",
      level: "warn",
      message: "Task created",
      data: {
        token: "secret",
        nested: {
          accessToken: "secret",
          visible: "ok",
        },
      },
    } as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "task.created",
        severityText: "warn",
        attributes: expect.objectContaining({
          "yalc.event.name": "task.created",
          "yalc.event.level": "warn",
          "yalc.event.payload":
            '{"token":"[masked]","nested":{"accessToken":"[masked]","visible":"ok"}}',
        }),
      })
    );
  });

  it("records event errors as telemetry attributes", () => {
    const emit = jest.fn();
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    service.recordYalcEvent("task.failed", {
      eventName: "task.failed",
      level: "error",
      message: "Task failed",
      errorInfo: {
        errorName: "TaskError",
        message: "Task failed",
        errorCode: "TASK_FAILED",
      },
    } as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "task.failed",
        severityText: "error",
        attributes: expect.objectContaining({
          "yalc.event.has_error": true,
          "yalc.error.name": "TaskError",
          "yalc.error.message": "Task failed",
          "yalc.error.code": "TASK_FAILED",
        }),
      })
    );
  });

  it("respects throw failure mode for telemetry backend failures", () => {
    const emit = jest.fn(() => {
      throw new Error("telemetry failed");
    });
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        failureMode: "throw",
      })
    );

    expect(() =>
      service.recordYalcEvent("task.created", {
        eventName: "task.created",
      } as any)
    ).toThrow("telemetry failed");
  });

  it("runs the wrapped operation when span setup fails in ignore mode", async () => {
    jest.spyOn(trace, "getTracer").mockReturnValue({
      startActiveSpan: () => {
        throw new Error("span setup failed");
      },
    } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    await expect(
      service.measure("test.operation", async () => "ok")
    ).resolves.toBe("ok");
  });

  it("throws when span setup fails in throw mode", () => {
    jest.spyOn(trace, "getTracer").mockReturnValue({
      startActiveSpan: () => {
        throw new Error("span setup failed");
      },
    } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        failureMode: "throw",
      })
    );

    expect(() => service.measure("test", () => "ok")).toThrow("span setup failed");
  });

  it("ignores errors during execute when failureMode is ignore", () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        failureMode: "ignore",
      })
    );

    const emit = jest.fn(() => {
      throw new Error("failed");
    });
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);

    // Should not throw
    service.recordYalcEvent("test");
  });

  it("does nothing when recording events while disabled", () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: false,
        serviceName: "test",
      })
    );
    expect(service.recordYalcEvent("test")).toBeUndefined();
  });

  it("does nothing when recording duration while disabled", () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: false,
        serviceName: "test",
      })
    );
    expect(service.recordDuration("test", 100)).toBeUndefined();
  });

  it("normalizes complex attributes", () => {
    expect(toTelemetryAttributes()).toEqual({});
    expect(toTelemetryAttributes({ string: "v" })).toEqual({ string: "v" });

    // Mock safeJsonStringify maximum size behavior by creating a very large string inside an object
    const largeObject = { largeString: "a".repeat(5000) };
    const attributes = toTelemetryAttributes({ largeObject });
    expect((attributes.largeObject as string).length).toBe(4096);

    expect(
      toTelemetryAttributes({
        string: "value",
        number: 1,
        boolean: true,
        object: { ok: true },
        array: ["a", 1, true, { ignored: true }],
        missing: undefined,
        fallbackBigInt: BigInt(1),
        fallbackSymbol: Symbol("test"),
      })
    ).toEqual({
      string: "value",
      number: 1,
      boolean: true,
      object: '{"ok":true}',
      array: '["a",1,true,{"ignored":true}]',
      fallbackBigInt: "1",
      fallbackSymbol: "Symbol(test)",
    });
  });

  it("masks arrays correctly", () => {
    const emit = jest.fn();
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        payload: {
          include: true,
          mask: ["token"],
        },
      })
    );

    service.recordYalcEvent("task.created", {
      data: [{ token: "secret" }, "normal"],
      level: "debug",
    } as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        severityText: "debug",
        attributes: expect.objectContaining({
          "yalc.event.payload": '[{"token":"[masked]"},"normal"]',
        }),
      })
    );

    service.recordYalcEvent("task.verbose", {
      level: "verbose",
    } as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        severityText: "verbose",
      })
    );

    service.recordYalcEvent("task.default", {} as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        severityText: "info",
      })
    );
  });

  it("handles various errorInfo formats", () => {
    const emit = jest.fn();
    jest.spyOn(logs, "getLogger").mockReturnValue({ emit } as any);
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    service.recordYalcEvent("task.failed", {
      errorInfo: {
        internalMessage: "internal failure",
      },
    } as any);

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: expect.objectContaining({
          "yalc.error.message": "internal failure",
        }),
      })
    );
  });

  it("normalizes non-Error objects in failSpan", async () => {
    const service = new TelemetryService(
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
      })
    );

    await expect(
      service.measure("test.failure", async () => {
        throw "string error";
      })
    ).rejects.toEqual("string error");
  });
});
