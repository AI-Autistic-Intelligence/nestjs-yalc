var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
import { CannotExecuteNotConnectedError, MigrationExecutor, } from 'typeorm';
import { getDBNameByConnection } from './conn.helper';
import * as Engine from 'typeorm-model-generator/dist/src/Engine';
import { getDefaultConnectionOptions } from 'typeorm-model-generator/dist/src/IConnectionOptions';
import { getDefaultGenerationOptions } from 'typeorm-model-generator/dist/src/IGenerationOptions';
import { SeedService } from './seed.service';
let DbOpsService = class DbOpsService {
    constructor(_options, loggerService, seedService, dbConnections) {
        this.loggerService = loggerService;
        this.seedService = seedService;
        this.dbConnections = dbConnections;
    }
    async closeAllConnections() {
        for (const v of this.dbConnections) {
            if (v.conn.isConnected)
                await v.conn.close();
        }
    }
    async create() {
        for (const v of this.dbConnections) {
            const queryRunner = v.conn.createQueryRunner();
            this.loggerService.log('Creating ' + v.dbName);
            await queryRunner.createDatabase(v.dbName, true);
        }
    }
    async sync(throwOnError = false, dropTables = false) {
        this.loggerService.debug?.('Synchronizing db...');
        for (const v of this.dbConnections) {
            this.loggerService.debug?.(`Synchronizing ${v.dbName}...`);
            try {
                await v.conn.synchronize(dropTables);
            }
            catch (e) {
                if (throwOnError) {
                    throw e;
                }
                else {
                    this.loggerService.debug?.(`${v.dbName} not Synchronized`);
                }
            }
        }
        this.loggerService.debug?.('Synchronze completed!');
    }
    async drop() {
        for (const v of this.dbConnections) {
            const queryRunner = v.conn.createQueryRunner();
            this.loggerService.debug?.(`Dropping ${v.dbName}`);
            await queryRunner.dropDatabase(v.dbName, true);
        }
    }
    async migrate(options) {
        this.loggerService.debug?.('Migrating db...');
        if (options?.selMigrations) {
            this.loggerService.debug?.(`Selected migrations ${JSON.stringify(options.selMigrations)}`);
        }
        for (const v of this.dbConnections) {
            if (!v.conn.isConnected)
                throw new CannotExecuteNotConnectedError(v.conn.name);
            const queryRunner = v.conn.createQueryRunner();
            const migrationExecutor = new MigrationExecutor(v.conn, queryRunner);
            migrationExecutor.transaction = 'all';
            const migrations = await migrationExecutor.getAllMigrations();
            const dbName = v.conn.driver.database ?? v.dbName;
            if (!Array.isArray(migrations) || migrations.length <= 0) {
                this.loggerService.debug?.(`No migrations available on ${dbName}`);
                continue;
            }
            if (options?.selMigrations) {
                this.loggerService.debug?.(`Executing selected migrations on ${dbName}`);
                const pendingMigrations = await migrationExecutor.getPendingMigrations();
                const selectedMigrations = dbName
                    ? options.selMigrations[dbName]
                    : true;
                for (const migration of pendingMigrations) {
                    if (selectedMigrations === true ||
                        (Array.isArray(selectedMigrations) &&
                            selectedMigrations.includes(migration.name))) {
                        this.loggerService.debug?.(`Executing migration ${migration.name} for ${dbName}`);
                        await migrationExecutor.executeMigration(migration);
                    }
                }
            }
            else {
                this.loggerService.debug?.(`Executing migration for ${dbName}`);
                await migrationExecutor.executePendingMigrations();
            }
        }
        if (options?.reseed) {
            await this.seedService.seedDatabases(true);
        }
        this.loggerService.debug?.('Migration completed!');
    }
    async generate(dbName, tables, genPath) {
        this.loggerService.debug?.('Exporting db to TypeORM entities...');
        const driver = Engine.createDriver('mysql');
        const mysqlConnectionOptions = [];
        this.dbConnections.forEach(({ conn: { options } }) => {
            if (isMysqlConnectionOption(options) && dbName === options.database) {
                mysqlConnectionOptions.push(options);
            }
        });
        if (!mysqlConnectionOptions.length) {
            this.loggerService.error(`There is no MySQL database connection configured for ${dbName}. ` +
                'Please refer to the documentation for Database Connection Setup');
            return;
        }
        for (const options of mysqlConnectionOptions) {
            const connOptions = {
                ...getDefaultConnectionOptions(),
                host: options.host ?? '127.0.0.1',
                port: options.port ?? 3306,
                password: options.password ?? '',
                user: options.username ?? '',
                databaseNames: options.database ? [options.database] : [],
                databaseType: options.type,
                onlyTables: tables,
            };
            const generationOptions = {
                ...getDefaultGenerationOptions(),
            };
            if (genPath) {
                generationOptions.resultsPath = genPath;
            }
            generationOptions.resultsPath += `/${dbName}`;
            await Engine.createModelFromDatabase(driver, connOptions, generationOptions);
        }
        this.loggerService.debug?.('Export complete!');
    }
};
DbOpsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, Object, typeof (_a = typeof SeedService !== "undefined" && SeedService) === "function" ? _a : Object, Array])
], DbOpsService);
export { DbOpsService };
export function isMysqlConnectionOption(options) {
    return options.type === 'mysql';
}
export const dbConnectionMap = (c) => ({
    conn: c,
    dbName: c.options.database?.toString() ?? getDBNameByConnection(c.name),
});
export const DbObpsServiceFactory = (loggerServiceToken, connectionTokens) => ({
    provide: DbOpsService,
    useFactory: async (loggerService, seedService, ...dbConnections) => {
        return new DbOpsService({}, loggerService, seedService, dbConnections.map(dbConnectionMap));
    },
    inject: [loggerServiceToken, SeedService, ...connectionTokens],
});
//# sourceMappingURL=db-ops.service.js.map