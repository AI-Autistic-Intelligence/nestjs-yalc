import { EntitySchema } from 'typeorm';
import { Seeder } from 'typeorm-seeding';
import { DbConfObject } from './conf.interface';
type TypeOrmEntityType = Function | string | EntitySchema<any>;
type DbConfigObjectParams = {
    dbName?: string;
    entities: TypeOrmEntityType[];
    seeds?: {
        new (): Seeder;
    }[];
    sourceDir?: string;
    migrationsDir?: string;
    extraMigrationDirs?: string[];
    connectionName?: string;
    __seedAsync?: boolean;
};
export declare function buildDbConfigObject({ dbName, entities, seeds, sourceDir, migrationsDir, extraMigrationDirs, connectionName, __seedAsync, }: DbConfigObjectParams): DbConfObject;
export {};
