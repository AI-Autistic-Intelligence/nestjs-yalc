import { Test, TestingModule } from '@nestjs/testing';
import { BaseAppController } from '../base-app.controller.js';
import { BaseAppService } from '../base-app.service.js';
import { ConfigService } from '@nestjs/config';
import { Controller } from '@nestjs/common';

@Controller()
class TestAppController extends BaseAppController {}

describe('BaseAppController', () => {
  let controller: TestAppController;
  let mockAppService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockAppService = {
      getHello: jest.fn().mockReturnValue('Hello World'),
    };
    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAppController],
      providers: [
        { provide: BaseAppService, useValue: mockAppService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<TestAppController>(TestAppController);
  });

  describe('getHello', () => {
    it('should return hello with app name', () => {
      mockConfigService.get.mockReturnValue({ appName: 'test-app' });
      expect(controller.getHello()).toBe('Hello World');
      expect(mockAppService.getHello).toHaveBeenCalledWith('test-app');
    });

    it('should return hello with default name when conf is missing', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(controller.getHello()).toBe('Hello World');
      expect(mockAppService.getHello).toHaveBeenCalledWith('no-name');
    });
  });

  describe('shutdown', () => {
    let mockExit: jest.SpyInstance;
    let mockLog: jest.SpyInstance;

    beforeEach(() => {
      mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      mockLog = jest.spyOn(console, 'log').mockImplementation((() => {}) as any);
    });

    afterEach(() => {
      mockExit.mockRestore();
      mockLog.mockRestore();
    });

    it('should shutdown in dev mode', () => {
      mockConfigService.get.mockReturnValue({ isDev: true });
      controller.shutdown();
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockLog).toHaveBeenCalledWith('Bye bye!');
    });

    it('should shutdown in test mode', () => {
      mockConfigService.get.mockReturnValue({ isTest: true });
      controller.shutdown();
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockLog).toHaveBeenCalledWith('Bye bye!');
    });

    it('should not shutdown if neither dev nor test', () => {
      mockConfigService.get.mockReturnValue({ isDev: false, isTest: false });
      controller.shutdown();
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockLog).not.toHaveBeenCalled();
    });

    it('should not shutdown if conf is missing', () => {
      mockConfigService.get.mockReturnValue(undefined);
      controller.shutdown();
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockLog).not.toHaveBeenCalled();
    });
  });
});
