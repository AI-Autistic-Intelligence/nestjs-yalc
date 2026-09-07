"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbObpsServiceFactory = exports.dbConnectionMap = exports.DbOpsService = void 0;
exports.isMysqlConnectionOption = isMysqlConnectionOption;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const conn_helper_1 = require("./conn.helper");
const Engine = __importStar(require("typeorm-model-generator/dist/src/Engine"));
const IConnectionOptions_1 = require("typeorm-model-generator/dist/src/IConnectionOptions");
const IGenerationOptions_1 = require("typeorm-model-generator/dist/src/IGenerationOptions");
const seed_service_1 = require("./seed.service");
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
                throw new typeorm_1.CannotExecuteNotConnectedError(v.conn.name);
            const queryRunner = v.conn.createQueryRunner();
            const migrationExecutor = new typeorm_1.MigrationExecutor(v.conn, queryRunner);
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
                ...(0, IConnectionOptions_1.getDefaultConnectionOptions)(),
                host: options.host ?? '127.0.0.1',
                port: options.port ?? 3306,
                password: options.password ?? '',
                user: options.username ?? '',
                databaseNames: options.database ? [options.database] : [],
                databaseType: options.type,
                onlyTables: tables,
            };
            const generationOptions = {
                ...(0, IGenerationOptions_1.getDefaultGenerationOptions)(),
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
exports.DbOpsService = DbOpsService;
exports.DbOpsService = DbOpsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, seed_service_1.SeedService, Array])
], DbOpsService);
function isMysqlConnectionOption(options) {
    return options.type === 'mysql';
}
const dbConnectionMap = (c) => ({
    conn: c,
    dbName: c.options.database?.toString() ?? (0, conn_helper_1.getDBNameByConnection)(c.name),
});
exports.dbConnectionMap = dbConnectionMap;
const DbObpsServiceFactory = (loggerServiceToken, connectionTokens) => ({
    provide: DbOpsService,
    useFactory: async (loggerService, seedService, ...dbConnections) => {
        return new DbOpsService({}, loggerService, seedService, dbConnections.map(exports.dbConnectionMap));
    },
    inject: [loggerServiceToken, seed_service_1.SeedService, ...connectionTokens],
});
exports.DbObpsServiceFactory = DbObpsServiceFactory;
//# sourceMappingURL=db-ops.service.js.map