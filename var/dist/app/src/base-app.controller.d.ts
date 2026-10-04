import { ConfigService } from '@nestjs/config';
import { BaseAppService } from './base-app.service.js';
export declare abstract class BaseAppController {
    protected readonly appService: BaseAppService;
    protected readonly configService: ConfigService;
    constructor(appService: BaseAppService, configService: ConfigService);
    getHello(): string;
    shutdown(): void;
}
