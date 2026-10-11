import * as common from '@nestjs/common';
/**
 * Application service
 */
export declare class BaseAppService {
    protected logger: common.LoggerService;
    constructor(logger: common.LoggerService);
    /**
     * Hello world function
     */
    getHello(appName: string): string;
    handleBeforeAllRoutes(context: common.ExecutionContext): void;
}
