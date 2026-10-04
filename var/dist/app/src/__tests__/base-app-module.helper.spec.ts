import { describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import {
  YalcBaseAppModule,
  registerSingletonDynamicModule,
  envFilePathList,
  buildEnvFilePath,
  yalcBaseAppModuleMetadataFactory,
  YalcDefaultAppModule,
  getCachedModule,
  YalcGlobalStaticModule,
} from '../base-app-module.helper.js';
import { LifeCycleHandler } from '../life-cycle-handler.service.js';
import { DynamicModule, Module } from '@nestjs/common';
import { IYalcBaseAppOptions } from '../base-app.interface.js';
import { createMock } from '@golevelup/ts-jest';
import { AppContextService } from '../app-context.service.js';
import {
  MAIN_APP_CONFIG_SERVICE,
  SYSTEM_LOGGER_SERVICE,
} from '../def.const.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

let appContextService: AppContextService = createMock<AppContextService>({
  initializedApps: new Set(),
});

class DummyDynamicModule extends YalcBaseAppModule {
  static forRoot(options?: IYalcBaseAppOptions): DynamicModule {
    return this.assignDynamicProperties(
      yalcBaseAppModuleMetadataFactory(this, 'appAlias', {
        ...this.assignDynamicProperties({}),
        configFactory: () => ({}),
        logger: true,
        isSingleton: true,
        imports: [YalcDefaultAppModule.forRoot('appAlias', [])],
        ...options,
      }),
      options,
    );
  }
}

@Module({
  imports: [
    DummyDynamicModule.forRoot({
      providers: [
        {
          provide: 'test1',
          useValue: 'test',
        },
      ],
    }),
  ],
})
class DummyStaticModule1 {}

@Module({
  imports: [
    DummyDynamicModule.forRoot({
      providers: [
        {
          provide: 'test2',
          useValue: 'test',
        },
      ],
    }),
  ],
})
class DummyStaticModule2 {}

describe('base-app', () => {
  describe('actual Nest module instantiation', () => {
    it('should create dynamic module', async () => {
      const module = await Test.createTestingModule({
        imports: [DummyStaticModule2, DummyStaticModule1],
      })
        .overrideProvider(AppContextService)
        .useValue(appContextService);

      const moduleRef = await module.compile();

      const lifeCycleHandler = moduleRef.get(LifeCycleHandler);
      const appConfigService = moduleRef.get(MAIN_APP_CONFIG_SERVICE);
      const systemLoggerService = moduleRef.get(SYSTEM_LOGGER_SERVICE);

      expect(module).toBeDefined();
      expect(lifeCycleHandler).toBeDefined();
      expect(appConfigService).toBeDefined();
      expect(systemLoggerService).toBeDefined();
    });

    it('should create dynamic module with logger option', async () => {
      const module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true }),
          YalcDefaultAppModule.forRoot('appAlias2', [], {
            logger: () => ({
              provide: SYSTEM_LOGGER_SERVICE,
              useFactory: () => ({
                error: jest.fn(),
                log: jest.fn(),
                warn: jest.fn(),
                debug: jest.fn(),
                verbose: jest.fn(),
                setContext: jest.fn(),
              } as any),
            } as any),
          }),
        ],
      })
        .overrideProvider(AppContextService)
        .useValue(appContextService)
        .overrideProvider(ConfigService)
        .useValue({ get: () => ({}) });

      const moduleRef = await module.compile();
      const systemLoggerService = moduleRef.get(SYSTEM_LOGGER_SERVICE);
      expect(systemLoggerService).toBeDefined();
    });
  });

  describe('YalcBaseAppModule', () => {
    it('should be defined', () => {
      expect(YalcBaseAppModule).toBeDefined();
    });

    it('should create dynamic properties', () => {
      const dynamicProperties = YalcBaseAppModule.assignDynamicProperties({});
      expect(dynamicProperties).toEqual({
        module: YalcBaseAppModule,
        global: true,
        isSingleton: false,
      });
    });

    it('should create dynamic properties with options', () => {
      const dynamicProperties = YalcBaseAppModule.assignDynamicProperties(
        {},
        {
          global: false,
          isSingleton: true,
        },
      );
      expect(dynamicProperties).toEqual({
        module: YalcBaseAppModule,
        global: false,
        isSingleton: true,
      });
    });

    it('should create dynamic module for standalone', () => {
      const dynamicModule = YalcBaseAppModule._forRootStandalone('appAlias');
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.global).toBe(true);
      expect(dynamicModule.isSingleton).toBe(false);
    });

    it('should create dynamic module', () => {
      const dynamicModule = YalcBaseAppModule._forRoot('appAlias');
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.global).toBe(true);
      expect(dynamicModule.isSingleton).toBe(false);
    });
  });

  describe('registerSingletonDynamicModule', () => {
    class TestModule extends DummyDynamicModule {
      static forRoot(options?: IYalcBaseAppOptions | undefined): DynamicModule {
        return this._forRoot('test', options);
      }
    }

    it('should register singleton dynamic module', () => {
      const config = TestModule.forRoot();
      const result = registerSingletonDynamicModule(true, TestModule, config);
      expect(result).toBe(config);
    });

    it('should not register the same singleton dynamic module twice', () => {
      const result = registerSingletonDynamicModule(
        true,
        TestModule,
        TestModule.forRoot(),
      );
      expect(result).not.toBe(true);
    });
  });

  describe('getCachedModule', () => {
    it('should return null when isSingleton is false', () => {
      expect(getCachedModule('someModule', false)).toBeNull();
    });

    it('should return cached module if it exists and isSingleton is true', () => {
      registerSingletonDynamicModule(true, 'someModule', 'cachedData');
      expect(getCachedModule('someModule', true)).toBe('cachedData');
    });

    it('should handle undefined isSingleton', () => {
      expect(getCachedModule('someModule')).toBeNull();
    });
  });

  describe('envFilePathList', () => {
    it('should create env file path list with undefined argument', () => {
      const paths = envFilePathList();
      expect(paths).toContain('./.env');
    });
    it('should behave same as buildEnvFilePath', () => {
      expect(buildEnvFilePath('.')).toEqual(envFilePathList('.'));
    });
    it('should create env file path list', () => {
      expect(YalcGlobalStaticModule).toBeDefined();
      const paths = envFilePathList('.');
      expect(paths).toContain('./.env');
      if (process.env.NODE_ENV) {
        expect(paths).toContain(`./.env.${process.env.NODE_ENV}`);
      }
      if (process.env.NODE_ENV !== 'production') {
        expect(paths).toContain('./.env.dist');
      }
    });

    it('should create env file path list for production', () => {
      process.env.NODE_ENV = 'production';
      const paths = envFilePathList('.');
      expect(paths).toContain('./.env');
      expect(paths).toContain(`./.env.production`);
      expect(paths).not.toContain('./.env.dist');
      process.env.NODE_ENV = 'test';
    });
  });

  describe('baseAppModuleMetadataFactory', () => {
    it('should create base app module metadata', () => {
      const metadata = yalcBaseAppModuleMetadataFactory({}, 'appAlias', {
        logger: true,
        global: true,
      });
      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([]);
    });

    it('should create base app module metadata with options', () => {
      const metadata = yalcBaseAppModuleMetadataFactory({}, 'appAlias', {
        envPath: ['./.env.test'],
        extraConfigs: [],
        providers: [],
        imports: [],
        exports: [],
        controllers: [],
      });
      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([]);
    });

    it('should create base app module metadata with options and controllers, with envPath as a string', () => {
      class TestController {}

      const metadata = yalcBaseAppModuleMetadataFactory(
        DummyStaticModule1,
        'appAlias',
        {
          envPath: './.env.test',
          extraConfigs: [],
          providers: [],
          imports: [],
          exports: [],
          controllers: [TestController],
        },
      );
      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([TestController]);
    });

    it('should create base app module metadata without envPath', () => {
      class TestController {}

      const metadata = yalcBaseAppModuleMetadataFactory(
        DummyStaticModule1,
        'appAlias',
        {
          extraConfigs: [],
          providers: [],
          imports: [],
          exports: [],
          controllers: [TestController],
        },
      );
      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([TestController]);
    });
  });
});
