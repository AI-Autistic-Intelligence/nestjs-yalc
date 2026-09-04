import { LoggerService, Provider } from '@nestjs/common';
import { Connection, ConnectionOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SeedService } from './seed.service';
export type MigrationSelection = {
    [database: string]: string[];
};
export interface MigrationOptions {
    selMigrations?: MigrationSelection;
    reseed?: boolean;
}
export declare class DbOpsService {
    private loggerService;
    private seedService;
    private dbConnections;
    constructor(_options: any, loggerService: LoggerService, seedService: SeedService, dbConnections: {
        conn: Connection;
        dbName: string;
    }[]);
    closeAllConnections(): Promise<void>;
    create(): Promise<void>;
    sync(throwOnError?: boolean, dropTables?: boolean): Promise<void>;
    drop(): Promise<void>;
    migrate(options?: MigrationOptions): Promise<void>;
    generate(dbName: string, tables: string[], genPath?: string): Promise<void>;
}
export declare function isMysqlConnectionOption(options: ConnectionOptions | MysqlConnectionOptions): options is MysqlConnectionOptions;
export declare const dbConnectionMap: (c: Connection) => {
    conn: Connection;
    dbName: any;
};
export declare const DbObpsServiceFactory: (loggerServiceToken: string, connectionTokens: any[]) => Provider;
