import { ConfigService } from '@nestjs/config';
import { BaseAppService } from './base-app.service.js';
/**
 * Application controller
 */
export declare abstract class BaseAppController {
    protected readonly appService: BaseAppService;
    protected readonly configService: ConfigService;
    constructor(appService: BaseAppService, configService: ConfigService);
    /**
     * Expose the getHello method
     */
    getHello(): string;
    /**
     * Only for dev purpose
     */
    shutdown(): void;
}
