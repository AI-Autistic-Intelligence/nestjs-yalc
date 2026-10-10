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

import { createMock } from '@golevelup/ts-jest';
// @ts-ignore
import { HttpAdapterHost } from '@nestjs/common';
import { ContextCallServiceFactory } from '../context-call.service.js';
import { NestLocalCallStrategy } from '../index.js';

describe('ContextCallServiceFactory', () => {
  let httpAdapterHost: HttpAdapterHost;

  beforeEach(() => {
    httpAdapterHost = createMock<HttpAdapterHost>();
  });

  it('should be defined', () => {
    expect(ContextCallServiceFactory).toBeDefined();
  });

  it('should return a class', () => {
    const ContextCallService = ContextCallServiceFactory(
      // @ts-ignore
      new NestLocalCallStrategy(httpAdapterHost),
    );
    expect(ContextCallService).toBeDefined();
  });

  it('should return a class that can be instantiated', () => {
    const ContextCallService = ContextCallServiceFactory(
      // @ts-ignore
      new NestLocalCallStrategy(httpAdapterHost),
    );
    const instance = new ContextCallService();
    expect(instance).toBeDefined();
  });

  it('should return a class that can set and get a strategy', () => {
    const ContextCallService = ContextCallServiceFactory(
      // @ts-ignore
      new NestLocalCallStrategy(httpAdapterHost),
    );
    const instance = new ContextCallService();
    // @ts-ignore
    const strategy = new NestLocalCallStrategy(httpAdapterHost);
    // @ts-ignore
    instance.setStrategy(strategy);
    expect(instance.getStrategy()).toBe(strategy);
  });
});
