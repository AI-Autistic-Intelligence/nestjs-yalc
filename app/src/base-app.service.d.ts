import * as common from '@nestjs/common';
export declare class BaseAppService {
    protected logger: common.LoggerService;
    constructor(logger: common.LoggerService);
    getHello(appName: string): string;
    handleBeforeAllRoutes(context: common.ExecutionContext): void;
}
