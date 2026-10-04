import { describe, expect, it, jest } from '@jest/globals';
import { BaseAppBootstrap } from '../app-bootstrap-base.helper.js';

class DummyModule {}

class TestBootstrap extends BaseAppBootstrap<any> {
  constructor() {
    super('test-app', DummyModule as any, {
      globalsOptions: { skipMultiServerCheck: true },
    });
  }
}

describe('BaseAppBootstrap', () => {
  it('should monkey patch app init/close and update flags', async () => {
    const bootstrap = new TestBootstrap();

    const closeFn = jest.fn().mockResolvedValue(undefined);
    const initFn = jest.fn().mockResolvedValue(undefined);

    const fakeApp: any = {
      close: closeFn,
      init: initFn,
      get: jest.fn(),
      useLogger: jest.fn(),
    };

    bootstrap.setApp(fakeApp);

    expect(bootstrap.isAppClosed()).toBe(false);
    await fakeApp.init();
    expect(bootstrap.isAppClosed()).toBe(false);

    await bootstrap.closeApp();
    expect(closeFn).toHaveBeenCalled();
    expect(bootstrap.isAppClosed()).toBe(true);
  });

  it('should getConf and getModule correctly', () => {
    const bootstrap = new TestBootstrap();
    const mockConfig = { get: jest.fn().mockReturnValue('mock-conf') };
    const fakeApp: any = {
      close: jest.fn(),
      init: jest.fn(),
      get: jest.fn().mockReturnValue(mockConfig),
      useLogger: jest.fn(),
    };
    bootstrap.setApp(fakeApp);
    
    expect(bootstrap.getConf()).toEqual('mock-conf');
    expect(bootstrap.getModule()).toBeDefined();
    expect(mockConfig.get).toHaveBeenCalledWith('test-app');
  });

  it('should throw error when bootstrapping multiple servers without skip flag', () => {
    // We already bootstrapped TestBootstrap in the previous tests.
    // It is in getBootstrappedApps() unless we clear it.
    // But since we want to trigger line 81, we can just instantiate another one without skip flag.
    class TestBootstrapNoSkip extends BaseAppBootstrap<any> {
      constructor() {
        super('test-app-2', DummyModule as any, {
          globalsOptions: { skipMultiServerCheck: false },
        });
      }
    }
    
    // Set env to not skip
    const oldEnv = process.env.APP_SKIP_MULTISERVER_CHECK;
    process.env.APP_SKIP_MULTISERVER_CHECK = 'false';
    
    expect(() => new TestBootstrapNoSkip()).toThrow('You are trying to bootstrap multiple servers');
    
    process.env.APP_SKIP_MULTISERVER_CHECK = oldEnv;
  });

  it('getMainBootstrappedApp should return the first app', () => {
    const { getMainBootstrappedApp } = require('../app-bootstrap-base.helper.js');
    const mainApp = getMainBootstrappedApp();
    expect(mainApp).toBeDefined();
  });

  it('should return bootstrapped apps', () => {
    const apps = require('../app-bootstrap-base.helper.js').getBootstrappedApps();
    expect(apps).toBeDefined();
  });
});
