import { ExceptionFilter } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
export declare class SystemExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(error: Error): Error;
}
