import { LoggerService, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { SeedService as NodeSeedService } from '@node-yalc/database/seed.service';
export declare class SeedService extends NodeSeedService {
    constructor(dbConnections: Connection[], loggerService: LoggerService, configService: ConfigService, configPath: string);
}
export declare const SeedServiceFactory: (configPath: string, loggerService: string, connectionTokens: any[]) => Provider;
