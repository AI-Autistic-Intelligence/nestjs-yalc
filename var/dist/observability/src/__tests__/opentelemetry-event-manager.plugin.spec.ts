import { jest } from "@jest/globals";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  OpenTelemetryEventManagerPlugin,
  matchesEventPattern,
} from "../event-manager/opentelemetry-event-manager.plugin";
import { normalizeObservabilityOptions } from "../observability-options";

describe("OpenTelemetryEventManagerPlugin", () => {
  it("matches dot wildcard patterns", () => {
    expect(matchesEventPattern("task.created", "task.*")).toBe(true);
    expect(matchesEventPattern("task.domain.created", "task.**")).toBe(true);
    expect(matchesEventPattern("task.created", "observability.**")).toBe(false);
    expect(matchesEventPattern("task.created", "**")).toBe(true);
  });

  it("records matching EventEmitter2 events", () => {
    const emitter = new EventEmitter2();
    const telemetry = { recordYalcEvent: jest.fn() };
    const plugin = new OpenTelemetryEventManagerPlugin(
      { emitter },
      telemetry as any,
      normalizeObservabilityOptions({
        enabled: true,
        serviceName: "test",
        eventManager: {
          listenTo: ["task.**"],
          ignore: ["task.ignore"],
        },
      })
    );

    plugin.onModuleInit();
    emitter.emit("task.created", { eventName: "task.created" });
    emitter.emit("task.ignore", { eventName: "task.ignore" });
    plugin.onModuleDestroy();
    emitter.emit("task.after-destroy", { eventName: "task.after-destroy" });

    expect(telemetry.recordYalcEvent).toHaveBeenCalledTimes(1);
    expect(telemetry.recordYalcEvent).toHaveBeenCalledWith("task.created", {
      eventName: "task.created",
    });
  });

  it("does not attach listeners if disabled", () => {
    const emitter = new EventEmitter2();
    jest.spyOn(emitter, "onAny");
    const plugin = new OpenTelemetryEventManagerPlugin(
      { emitter },
      {} as any,
      normalizeObservabilityOptions({
        enabled: false,
        serviceName: "test",
      })
    );

    plugin.onModuleInit();
    expect(emitter.onAny).not.toHaveBeenCalled();
  });
});
