describe('EventService metadata branches', () => {
  it('should load class without Reflect.metadata', () => {
    jest.isolateModules(() => {
      const originalMetadata = Reflect.metadata;
      delete (Reflect as any).metadata;

      const { YalcEventService } = require('../event.service');
      expect(YalcEventService).toBeDefined();

      Reflect.metadata = originalMetadata;
    });
  });

  it('should load class without Reflect', () => {
    jest.isolateModules(() => {
      const originalReflect = global.Reflect;
      delete (global as any).Reflect;

      const { YalcEventService } = require('../event.service');
      expect(YalcEventService).toBeDefined();

      global.Reflect = originalReflect;
    });
  });

  it('should load class with undefined dependencies to cover typeof branches', () => {
    jest.isolateModules(() => {
      jest.mock('@nest-yalc-2/logger', () => ({
        ImprovedLoggerService: undefined,
      }));
      jest.mock('@nestjs/event-emitter', () => ({
        EventEmitter2: undefined,
      }));
      jest.mock('../global-emitter', () => ({
        globalEventEmitter: { emit: jest.fn() },
      }));

      const { YalcEventService } = require('../event.service');
      expect(YalcEventService).toBeDefined();
    });
  });
});
