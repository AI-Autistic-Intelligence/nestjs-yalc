import {
  expect,
  jest,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';

class NestLogger {
  setLogLevels: jest.Mock<any>;
  static overrideLogger = jest.fn();
}

jest.mock('@nestjs/common', () => ({
  ...(jest.requireActual('@nestjs/common') as any),
  Logger: NestLogger,
}));

import { LogLevelEnum, LoggerTypeEnum } from '../logger.enum.js';
import { NestAppLoggerFactory } from '../logger.factory.js';
import { PinoLogger } from '../logger-pino.service.js';

describe('NestAppLoggerFactory', () => {
  // let mockConfigService;
  let logger;

  it('No configuration test', async () => {
    logger = NestAppLoggerFactory(
      'test',
      [LogLevelEnum.DEBUG],
      LoggerTypeEnum.CONSOLE,
    );
    expect(logger).toBeDefined();

    logger = NestAppLoggerFactory(
      'test',
      [LogLevelEnum.DEBUG],
      LoggerTypeEnum.PINO,
    );
    expect(logger).toBeDefined();
    expect(logger instanceof PinoLogger).toBeTruthy();

    logger = NestAppLoggerFactory(
      'test',
      [LogLevelEnum.DEBUG],
      LoggerTypeEnum.NEST,
    );
    expect(logger).toBeDefined();

    logger = NestAppLoggerFactory('test', [LogLevelEnum.DEBUG]);
    expect(logger).toBeDefined();

    logger = NestAppLoggerFactory('test', []);
    expect(logger).toBeDefined();
  });

  it('No configuration test', async () => {
    logger = NestAppLoggerFactory('test');
    expect(logger).toBeDefined();

    NestLogger.prototype.setLogLevels = jest.fn();

    logger = NestAppLoggerFactory('test', [LogLevelEnum.DEBUG]);
    expect(logger).toBeDefined();
  });
});
