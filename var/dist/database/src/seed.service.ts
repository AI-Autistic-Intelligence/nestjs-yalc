import { Injectable, LoggerService, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { SeedService as NodeSeedService } from '@node-yalc/database/seed.service';

@Injectable()
export class SeedService extends NodeSeedService {
  constructor(
    dbConnections: Connection[],
    loggerService: LoggerService,
    configService: ConfigService,
    configPath: string,
  ) {
    super(dbConnections, loggerService as any, configService as any, configPath);
  }
}

export const SeedServiceFactory = (
  configPath: string,
  loggerService: string,
  connectionTokens: any[],
): Provider => ({
  provide: SeedService,
  useFactory: async (
    configService: ConfigService,
    loggerService: LoggerService,
    ...dbConnections: Connection[]
  ) => {
    return new SeedService(
      dbConnections,
      loggerService,
      configService,
      configPath,
    );
  },
  inject: [ConfigService, loggerService, ...connectionTokens],
});
