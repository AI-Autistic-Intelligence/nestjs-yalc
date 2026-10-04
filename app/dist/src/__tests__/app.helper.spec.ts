import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { StandaloneAppBootstrap } from '../app-bootstrap-standalone.helper.js';

import {
  executeFunctionForApp,
  curriedExecuteStandaloneFunction,
  executeStandaloneFunction,
  isDynamicModule,
} from '../app.helper.js';

describe('app.helper', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(StandaloneAppBootstrap.prototype, 'initApp').mockResolvedValue({
      getApp: jest.fn().mockReturnValue({
        init: jest.fn(),
        resolve: jest.fn().mockResolvedValue({}),
      }),
    } as any);
    jest.spyOn(StandaloneAppBootstrap.prototype, 'getApp').mockReturnValue({
      init: jest.fn(),
      resolve: jest.fn().mockResolvedValue({}),
    } as any);
    jest.spyOn(StandaloneAppBootstrap.prototype, 'closeApp').mockResolvedValue({} as any);
  });

  it('should evaluate isDynamicModule', () => {
    expect(isDynamicModule({ module: {} })).toBe(true);
    expect(isDynamicModule({})).toBe(false);
  });

  it('should execute function for app', async () => {
    const mockApp = {
      getApp: jest.fn().mockReturnValue({
        init: jest.fn(),
        resolve: jest.fn().mockResolvedValue({}),
      } as any),
      closeApp: jest.fn(),
    };
    
    const mockFn = jest.fn().mockResolvedValue({});
    
    await executeFunctionForApp(mockApp as any, {}, mockFn as any, { closeApp: true });
    
    expect(mockApp.getApp).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalled();
    expect(mockApp.closeApp).toHaveBeenCalled();
  });

  it('should create curried function', async () => {
    class DummyModule {}
    const curried = await curriedExecuteStandaloneFunction(DummyModule, { skipMultiServerCheck: true } as any);
    expect(typeof curried).toBe('function');
  });

  it('should create curried function with dynamic module', async () => {
    const dynamicModule = { module: { name: 'DynamicDummy' } };
    const curried = await curriedExecuteStandaloneFunction(dynamicModule, { skipMultiServerCheck: true } as any);
    expect(typeof curried).toBe('function');
  });

  it('should execute standalone function', async () => {
    class DummyModule {}
    class DummyService {}
    const mockFn = jest.fn().mockResolvedValue({});
    
    await executeStandaloneFunction(DummyModule, DummyService, mockFn, { skipMultiServerCheck: true } as any);
    
    expect(mockFn).toHaveBeenCalled();
  });
});
