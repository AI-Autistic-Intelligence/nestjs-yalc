import { jest } from "@jest/globals";
import { TelemetryCallStrategy } from "../strategies/telemetry-call.strategy";
import { TelemetryEventStrategy } from "../strategies/telemetry-event.strategy";

describe("telemetry strategy wrappers", () => {
  it("measures API calls and forwards baseUrl updates", async () => {
    const target = {
      baseUrl: "http://old",
      call: jest.fn(async () => ({ data: "call" })),
      get: jest.fn(async () => ({ data: "get" })),
      post: jest.fn(async () => ({ data: "post" })),
    };
    const telemetry = {
      measure: jest.fn((_name: string, callback: () => unknown) => callback()),
    };
    const strategy = new TelemetryCallStrategy(target, telemetry as any, {
      name: "tasks.http",
      transport: "http",
    });

    strategy.baseUrl = "http://new";

    await expect(strategy.call("/tasks")).resolves.toEqual({ data: "call" });
    await expect(strategy.get("/tasks")).resolves.toEqual({ data: "get" });
    await expect(strategy.post("/tasks")).resolves.toEqual({ data: "post" });
    expect(target.baseUrl).toBe("http://new");
    expect(strategy.baseUrl).toBe("http://new");
    expect(telemetry.measure).toHaveBeenCalledTimes(3);
  });

  it("measures event emits and destroys wrapped strategies", async () => {
    const target = {
      emit: jest.fn(() => true),
      emitAsync: jest.fn(async () => true),
      onModuleDestroy: jest.fn(async () => undefined),
    };
    const telemetry = {
      measure: jest.fn((_name: string, callback: () => unknown) => callback()),
    };
    const strategy = new TelemetryEventStrategy(target, telemetry as any, {
      name: "tasks-events",
      transport: "local",
    });

    expect(strategy.emit("task.created", {})).toBe(true);
    await expect(strategy.emitAsync("task.created", {})).resolves.toBe(true);
    await strategy.onModuleDestroy();

    expect(telemetry.measure).toHaveBeenCalledTimes(2);
    expect(target.onModuleDestroy).toHaveBeenCalled();
  });

  it("safely destroys when target lacks onModuleDestroy", async () => {
    const target = {
      emit: jest.fn(),
      emitAsync: jest.fn(),
    };
    const strategy = new TelemetryEventStrategy(target as any, {} as any, {
      name: "test",
    });

    await expect(strategy.onModuleDestroy()).resolves.toBeUndefined();
  });
});
