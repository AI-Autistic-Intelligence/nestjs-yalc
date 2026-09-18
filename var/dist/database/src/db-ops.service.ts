import { Injectable, LoggerService, Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SeedService } from './seed.service';
import {
  DbOpsService as NodeDbOpsService,
  isMysqlConnectionOption,
  MigrationOptions,
  MigrationSelection,
  dbConnectionMap,
} from '@node-yalc/database/db-ops.service';

export {
  isMysqlConnectionOption,
  MigrationOptions,
  MigrationSelection,
  dbConnectionMap,
};

@Injectable()
export class DbOpsService extends NodeDbOpsService {
  constructor(
    options: MigrationOptions,
    loggerService: LoggerService,
    seedService: SeedService,
    dbConnections: { conn: Connection; dbName: string }[],
  ) {
    super(options, loggerService as any, seedService, dbConnections);
  }
}

export const DbObpsServiceFactory = (
  loggerServiceToken: string,
  connectionTokens: any[],
): Provider => ({
  provide: DbOpsService,
  useFactory: async (
    loggerService: LoggerService,
    seedService: SeedService,
    ...dbConnections: Connection[]
  ) => {
    return new DbOpsService(
      {},
      loggerService,
      seedService,
      dbConnections.map(dbConnectionMap),
    );
  },
  inject: [loggerServiceToken, SeedService, ...connectionTokens],
});

