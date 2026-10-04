import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import '@nest-yalc-2/jest/common-mocks.helper.js';

import { AppBootstrap } from '../app-bootstrap.helper.js';
import { SYSTEM_LOGGER_SERVICE } from '../def.const.js';
import { UnwrapResultInterceptor } from '../unwrap-result.interceptor.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

jest.mock('class-validator', () => ({
  useContainer: jest.fn(),
}));

jest.mock('@fastify/cookie', () => jest.fn());

describe('AppBootstrap.applyBootstrapGlobals', () => {
  const logger = { log: jest.fn(), debug: jest.fn() };
  const customFilter = { handle: jest.fn() };
  const createDocumentMock = jest.fn().mockReturnValue({ doc: true });
  const setupSwaggerMock = jest.fn();
  const setTitleMock = jest.fn().mockReturnThis();
  const setDescriptionMock = jest.fn().mockReturnThis();
  const buildMock = jest.fn().mockReturnValue({ swagger: true });

  const fakeApp = {
    useGlobalPipes: jest.fn(),
    setGlobalPrefix: jest.fn(),
    register: jest.fn(),
    useGlobalInterceptors: jest.fn(),
    useGlobalFilters: jest.fn(),
    useLogger: jest.fn(),
    get: jest.fn().mockImplementation((token) =>
      token === SYSTEM_LOGGER_SERVICE ? logger : undefined,
    ),
    select: jest.fn().mockReturnValue({}),
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.spyOn(SwaggerModule, 'createDocument').mockImplementation((...args: any[]) =>
      createDocumentMock(...args),
    );
    jest.spyOn(SwaggerModule, 'setup').mockImplementation((...args: any[]) =>
      setupSwaggerMock(...args),
    );
    jest
      .spyOn(DocumentBuilder.prototype, 'setTitle')
      .mockImplementation(function (...args: any[]) {
        setTitleMock(...args);
        return this;
      });
    jest
      .spyOn(DocumentBuilder.prototype, 'setDescription')
      .mockImplementation(function (...args: any[]) {
        setDescriptionMock(...args);
        return this;
      });
    jest.spyOn(DocumentBuilder.prototype, 'build').mockImplementation((...args: any[]) =>
      buildMock(...args),
    );
  });

  it('should set up pipes, filters, interceptors and swagger', async () => {
    const bootstrap = new AppBootstrap(
      'app',
      class Dummy {},
      { skipMultiServerCheck: true } as any,
    );

    bootstrap['app'] = fakeApp as any;
    bootstrap['loggerService'] = logger as any;
    bootstrap.getConf = jest.fn().mockReturnValue({
      apiPrefix: 'api',
      host: 'localhost',
      port: 3000,
    }) as any;
    bootstrap.getModule = jest.fn().mockReturnValue({}) as any;

    await bootstrap.applyBootstrapGlobals({
      enableSwagger: true,
      apiPrefix: 'api',
      filters: [customFilter as any],
      validationPipeOptions: { transformOptions: { enableImplicitConversion: true } },
    });

    expect(fakeApp.useGlobalPipes).toHaveBeenCalled();
    expect(fakeApp.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(fakeApp.register).toHaveBeenCalled();
    expect(fakeApp.useGlobalInterceptors).toHaveBeenCalledWith(
      expect.any(UnwrapResultInterceptor),
    );
    expect(fakeApp.useGlobalFilters).toHaveBeenCalled();
    expect(createDocumentMock).toHaveBeenCalled();
    expect(setTitleMock).toHaveBeenCalled();
    expect(setDescriptionMock).toHaveBeenCalled();
    expect(setupSwaggerMock).toHaveBeenCalled();
  });
});

describe('AppBootstrap - additional coverage', () => {
  it('initApp should call createApp and initSetup', async () => {
    const bootstrap = new AppBootstrap('app', class Dummy {}, { skipMultiServerCheck: true } as any);
    bootstrap.createApp = jest.fn().mockResolvedValue(bootstrap as any);
    bootstrap.initSetup = jest.fn().mockResolvedValue(bootstrap as any);
    await bootstrap.initApp();
    expect(bootstrap.createApp).toHaveBeenCalled();
    expect(bootstrap.initSetup).toHaveBeenCalled();
  });

  it('initSetup should call applyBootstrapGlobals and init', async () => {
    const bootstrap = new AppBootstrap('app', class Dummy {}, { skipMultiServerCheck: true } as any);
    bootstrap.applyBootstrapGlobals = jest.fn();
    const mockApp = { init: jest.fn() };
    bootstrap.getApp = jest.fn().mockReturnValue(mockApp as any);
    await bootstrap.initSetup();
    expect(bootstrap.applyBootstrapGlobals).toHaveBeenCalled();
    expect(mockApp.init).toHaveBeenCalled();
  });

  it('createApp should call NestFactory.create and setApp', async () => {
    const bootstrap = new AppBootstrap('app', class Dummy {}, { skipMultiServerCheck: true } as any);
    bootstrap.setApp = jest.fn().mockReturnValue(bootstrap as any);
    const mockNestApp = {};
    const NestFactory = require('@nestjs/core').NestFactory;
    jest.spyOn(NestFactory, 'create').mockResolvedValue(mockNestApp as any);
    await bootstrap.createApp();
    expect(NestFactory.create).toHaveBeenCalled();
    expect(bootstrap.setApp).toHaveBeenCalledWith(mockNestApp);
  });

  it('createApp should handle errors during createApp', async () => {
    const bootstrap = new AppBootstrap('app', class Dummy {}, { skipMultiServerCheck: true } as any);
    const NestFactory = require('@nestjs/core').NestFactory;
    jest.spyOn(NestFactory, 'create').mockRejectedValue(new Error('test error') as never);
    bootstrap.closeCleanup = jest.fn() as any;
    // mock console.error
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(bootstrap.createApp()).rejects.toThrow('Process aborted');
    expect(bootstrap.closeCleanup).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
describe('AppBootstrap.applyBootstrapGlobals - no options', () => {
  it('should handle undefined options', async () => {
    const bootstrap = new AppBootstrap('app', class Dummy {}, { skipMultiServerCheck: true } as any);
    const fakeApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      register: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      useGlobalFilters: jest.fn(),
      get: jest.fn().mockReturnValue({ log: jest.fn(), debug: jest.fn() }),
      useLogger: jest.fn(),
      select: jest.fn().mockReturnValue({}),
    };
    bootstrap['app'] = fakeApp as any;
    bootstrap.getConf = jest.fn().mockReturnValue({}) as any;
    bootstrap.getModule = jest.fn().mockReturnValue({}) as any;
    await bootstrap.applyBootstrapGlobals();
    expect(fakeApp.useGlobalPipes).toHaveBeenCalled();
  });
});
