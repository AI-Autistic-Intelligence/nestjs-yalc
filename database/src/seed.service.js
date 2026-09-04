"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedServiceFactory = exports.SeedService = void 0;
const typeorm_seeding_1 = require("typeorm-seeding");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const conn_helper_1 = require("./conn.helper");
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
        var _a, _b, _c, _d, _e, _f;
        const dbConf = this.configService.get((0, conn_helper_1.getConfNameByConnection)(connection.name));
        if (!(dbConf === null || dbConf === void 0 ? void 0 : dbConf.seeds) || (dbConf === null || dbConf === void 0 ? void 0 : dbConf.seeds.length) === 0)
            return;
        this.resetConnection();
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, `Clear ${name} on connection: ${connection.name}...`);
        const queryRunner = connection.createQueryRunner();
        (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, `Clear ${name} tables`);
        await Promise.all(connection.entityMetadatas.map(async (meta) => {
            var _a, _b, _c, _d;
            const skipTable = await queryRunner.hasTable(meta.tableName);
            if (meta.tableType === 'view' || !skipTable) {
                (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, `Skip truncating ${name}.${meta.tableName}`);
                return;
            }
            (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, `Truncating ${name}.${meta.tableName}`);
            await queryRunner.clearTable(meta.tableName);
        }));
        (_f = (_e = this.loggerService).debug) === null || _f === void 0 ? void 0 : _f.call(_e, `Database ${name} cleared!`);
    }
    async seedDatabase(connection, name) {
        var _a, _b, _c, _d, _e, _f;
        const dbConf = this.configService.get((0, conn_helper_1.getConfNameByConnection)(connection.name));
        if (!(dbConf === null || dbConf === void 0 ? void 0 : dbConf.seeds) || (dbConf === null || dbConf === void 0 ? void 0 : dbConf.seeds.length) === 0)
            return;
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, `Seeding: ${name}`);
        const option = {
            root: this.configPath,
            configName: 'ormconfig',
            connection: connection.name,
        };
        this.resetConnection();
        await (0, typeorm_seeding_1.useSeeding)(option);
        this.setConnection(connection);
        const seeders = dbConf === null || dbConf === void 0 ? void 0 : dbConf.seeds;
        for (const seeder of seeders) {
            const label = `${name}.${seeder.name} execution time:`;
            console.time(label);
            (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, `Running seeder ${seeder.name} on ${name}`);
            await new seeder().run(typeorm_seeding_1.factory, connection);
            console.timeEnd(label);
        }
        (_f = (_e = this.loggerService).debug) === null || _f === void 0 ? void 0 : _f.call(_e, `Completed: ${name}`);
    }
    async seedDatabases(reseed) {
        var _a, _b, _c, _d;
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Seeding db...');
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
        (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, 'Seeding completed!');
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
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array, Object, config_1.ConfigService, String])
], SeedService);
const SeedServiceFactory = (configPath, loggerService, connectionTokens) => ({
    provide: SeedService,
    useFactory: async (configService, loggerService, ...dbConnections) => {
        return new SeedService(dbConnections, loggerService, configService, configPath);
    },
    inject: [config_1.ConfigService, loggerService, ...connectionTokens],
});
exports.SeedServiceFactory = SeedServiceFactory;
//# sourceMappingURL=seed.service.js.map