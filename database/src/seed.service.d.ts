import { Provider } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
/**
 * Application service
 */
export declare class SeedService {
    private dbConnections;
    private loggerService;
    private configService;
    private configPath;
    constructor(dbConnections: Connection[], loggerService: LoggerService, configService: ConfigService, configPath: string);
    closeAllConnections(): Promise<void>;
    private clearDatabase;
    private seedDatabase;
    seedDatabases(reseed: boolean): Promise<void>;
    /**
     *  Use it to reset connection options to be able to change database connection
     *
     */
    private resetConnection;
    private setConnection;
}
export declare const SeedServiceFactory: (configPath: string, loggerService: string, connectionTokens: any[]) => Provider;
