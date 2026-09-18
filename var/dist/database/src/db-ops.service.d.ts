import { LoggerService, Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SeedService } from './seed.service';
import { DbOpsService as NodeDbOpsService, isMysqlConnectionOption, MigrationOptions, MigrationSelection, dbConnectionMap } from '@node-yalc/database/db-ops.service';
export { isMysqlConnectionOption, MigrationOptions, MigrationSelection, dbConnectionMap, };
export declare class DbOpsService extends NodeDbOpsService {
    constructor(options: MigrationOptions, loggerService: LoggerService, seedService: SeedService, dbConnections: {
        conn: Connection;
        dbName: string;
    }[]);
}
export declare const DbObpsServiceFactory: (loggerServiceToken: string, connectionTokens: any[]) => Provider;
