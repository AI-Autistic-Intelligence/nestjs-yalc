import { __decorate, __metadata } from "tslib";
import { factory, useSeeding } from 'typeorm-seeding';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConfNameByConnection } from './conn.helper';
let SeedService = class SeedService {
    constructor(dbConnections, loggerService, configService, configPath) {
        this.dbConnections = dbConnections;
        this.loggerService = loggerService;
        this.configService = configService;
        this.configPath = configPath;
    }
    async closeAllConnections() {
        for (const v of this.dbConnections) {
            if (v.isConnected)
                await v.close();
        }
    }
    async clearDatabase(connection, name) {
        const dbConf = this.configService.get(getConfNameByConnection(connection.name));
        if (!dbConf?.seeds || dbConf?.seeds.length === 0)
            return;
        this.resetConnection();
        this.loggerService.debug?.(`Clear ${name} on connection: ${connection.name}...`);
        const queryRunner = connection.createQueryRunner();
        this.loggerService.debug?.(`Clear ${name} tables`);
        await Promise.all(connection.entityMetadatas.map(async (meta) => {
            const skipTable = await queryRunner.hasTable(meta.tableName);
            if (meta.tableType === 'view' || !skipTable) {
                this.loggerService.debug?.(`Skip truncating ${name}.${meta.tableName}`);
                return;
            }
            this.loggerService.debug?.(`Truncating ${name}.${meta.tableName}`);
            await queryRunner.clearTable(meta.tableName);
        }));
        this.loggerService.debug?.(`Database ${name} cleared!`);
    }
    async seedDatabase(connection, name) {
        const dbConf = this.configService.get(getConfNameByConnection(connection.name));
        if (!dbConf?.seeds || dbConf?.seeds.length === 0)
            return;
        this.loggerService.debug?.(`Seeding: ${name}`);
        const option = {
            root: this.configPath,
            configName: 'ormconfig',
            connection: connection.name,
        };
        this.resetConnection();
        await useSeeding(option);
        this.setConnection(connection);
        const seeders = dbConf?.seeds;
        for (const seeder of seeders) {
            const label = `${name}.${seeder.name} execution time:`;
            console.time(label);
            this.loggerService.debug?.(`Running seeder ${seeder.name} on ${name}`);
            await new seeder().run(factory, connection);
            console.timeEnd(label);
        }
        this.loggerService.debug?.(`Completed: ${name}`);
    }
    async seedDatabases(reseed) {
        this.loggerService.debug?.('Seeding db...');
        if (reseed) {
            await Promise.all(this.dbConnections.map(async (connection) => {
                if (!connection.options.database)
                    return;
                await this.clearDatabase(connection, connection.options.database.toString());
            }));
        }
        const promiseList = [];
        for (const connection of this.dbConnections) {
            if (connection.options.__seedAsync) {
                promiseList.push(async () => {
                    if (!connection.options.database)
                        return;
                    await this.seedDatabase(connection, connection.options.database.toString());
                });
            }
            else {
                if (!connection.options.database)
                    continue;
                await this.seedDatabase(connection, connection.options.database.toString());
            }
        }
        await Promise.all(promiseList.map((fn) => fn()));
        this.loggerService.debug?.('Seeding completed!');
    }
    resetConnection() {
        global['TypeORM_Seeding_Connection'] = {
            configureOption: {
                root: process.cwd(),
                configName: '',
                connection: '',
            },
            ormConfig: undefined,
            connection: undefined,
            overrideConnectionOptions: {},
        };
    }
    setConnection(connection) {
        global['TypeORM_Seeding_Connection']['connection'] = connection;
    }
};
SeedService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Array, Object, ConfigService, String])
], SeedService);
export { SeedService };
export const SeedServiceFactory = (configPath, loggerService, connectionTokens) => ({
    provide: SeedService,
    useFactory: async (configService, loggerService, ...dbConnections) => {
        return new SeedService(dbConnections, loggerService, configService, configPath);
    },
    inject: [ConfigService, loggerService, ...connectionTokens],
});
//# sourceMappingURL=seed.service.js.map