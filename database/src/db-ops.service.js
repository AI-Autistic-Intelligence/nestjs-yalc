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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Synchronizing db...');
        for (const v of this.dbConnections) {
            (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, `Synchronizing ${v.dbName}...`);
            try {
                await v.conn.synchronize(dropTables);
            }
            catch (e) {
                if (throwOnError) {
                    throw e;
                }
                else {
                    (_f = (_e = this.loggerService).debug) === null || _f === void 0 ? void 0 : _f.call(_e, `${v.dbName} not Synchronized`);
                }
            }
        }
        (_h = (_g = this.loggerService).debug) === null || _h === void 0 ? void 0 : _h.call(_g, 'Synchronze completed!');
    }
    async drop() {
        var _a, _b;
        for (const v of this.dbConnections) {
            const queryRunner = v.conn.createQueryRunner();
            (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, `Dropping ${v.dbName}`);
            await queryRunner.dropDatabase(v.dbName, true);
        }
    }
    async migrate(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Migrating db...');
        if (options === null || options === void 0 ? void 0 : options.selMigrations) {
            (_d = (_c = this.loggerService).debug) === null || _d === void 0 ? void 0 : _d.call(_c, `Selected migrations ${JSON.stringify(options.selMigrations)}`);
        }
        for (const v of this.dbConnections) {
            if (!v.conn.isConnected)
                throw new typeorm_1.CannotExecuteNotConnectedError(v.conn.name);
            const queryRunner = v.conn.createQueryRunner();
            const migrationExecutor = new typeorm_1.MigrationExecutor(v.conn, queryRunner);
            migrationExecutor.transaction = 'all';
            const migrations = await migrationExecutor.getAllMigrations();
            const dbName = (_e = v.conn.driver.database) !== null && _e !== void 0 ? _e : v.dbName;
            if (!Array.isArray(migrations) || migrations.length <= 0) {
                (_g = (_f = this.loggerService).debug) === null || _g === void 0 ? void 0 : _g.call(_f, `No migrations available on ${dbName}`);
                continue;
            }
            if (options === null || options === void 0 ? void 0 : options.selMigrations) {
                (_j = (_h = this.loggerService).debug) === null || _j === void 0 ? void 0 : _j.call(_h, `Executing selected migrations on ${dbName}`);
                const pendingMigrations = await migrationExecutor.getPendingMigrations();
                const selectedMigrations = dbName
                    ? options.selMigrations[dbName]
                    : true;
                for (const migration of pendingMigrations) {
                    if (selectedMigrations === true ||
                        (Array.isArray(selectedMigrations) &&
                            selectedMigrations.includes(migration.name))) {
                        (_l = (_k = this.loggerService).debug) === null || _l === void 0 ? void 0 : _l.call(_k, `Executing migration ${migration.name} for ${dbName}`);
                        await migrationExecutor.executeMigration(migration);
                    }
                }
            }
            else {
                (_o = (_m = this.loggerService).debug) === null || _o === void 0 ? void 0 : _o.call(_m, `Executing migration for ${dbName}`);
                await migrationExecutor.executePendingMigrations();
            }
        }
        if (options === null || options === void 0 ? void 0 : options.reseed) {
            await this.seedService.seedDatabases(true);
        }
        (_q = (_p = this.loggerService).debug) === null || _q === void 0 ? void 0 : _q.call(_p, 'Migration completed!');
    }
    async generate(dbName, tables, genPath) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_b = (_a = this.loggerService).debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Exporting db to TypeORM entities...');
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
            const connOptions = Object.assign(Object.assign({}, (0, IConnectionOptions_1.getDefaultConnectionOptions)()), { host: (_c = options.host) !== null && _c !== void 0 ? _c : '127.0.0.1', port: (_d = options.port) !== null && _d !== void 0 ? _d : 3306, password: (_e = options.password) !== null && _e !== void 0 ? _e : '', user: (_f = options.username) !== null && _f !== void 0 ? _f : '', databaseNames: options.database ? [options.database] : [], databaseType: options.type, onlyTables: tables });
            const generationOptions = Object.assign({}, (0, IGenerationOptions_1.getDefaultGenerationOptions)());
            if (genPath) {
                generationOptions.resultsPath = genPath;
            }
            generationOptions.resultsPath += `/${dbName}`;
            await Engine.createModelFromDatabase(driver, connOptions, generationOptions);
        }
        (_h = (_g = this.loggerService).debug) === null || _h === void 0 ? void 0 : _h.call(_g, 'Export complete!');
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
const dbConnectionMap = (c) => {
    var _a, _b;
    return ({
        conn: c,
        dbName: (_b = (_a = c.options.database) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : (0, conn_helper_1.getDBNameByConnection)(c.name),
    });
};
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