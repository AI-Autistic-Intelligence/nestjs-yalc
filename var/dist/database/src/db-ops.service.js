"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbObpsServiceFactory = exports.DbOpsService = exports.dbConnectionMap = exports.isMysqlConnectionOption = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seed.service");
const db_ops_service_1 = require("@node-yalc/database/db-ops.service");
Object.defineProperty(exports, "isMysqlConnectionOption", { enumerable: true, get: function () { return db_ops_service_1.isMysqlConnectionOption; } });
Object.defineProperty(exports, "dbConnectionMap", { enumerable: true, get: function () { return db_ops_service_1.dbConnectionMap; } });
let DbOpsService = class DbOpsService extends db_ops_service_1.DbOpsService {
    constructor(options, loggerService, seedService, dbConnections) {
        super(options, loggerService, seedService, dbConnections);
    }
};
exports.DbOpsService = DbOpsService;
exports.DbOpsService = DbOpsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object, Object, seed_service_1.SeedService, Array])
], DbOpsService);
const DbObpsServiceFactory = (loggerServiceToken, connectionTokens) => ({
    provide: DbOpsService,
    useFactory: async (loggerService, seedService, ...dbConnections) => {
        return new DbOpsService({}, loggerService, seedService, dbConnections.map(db_ops_service_1.dbConnectionMap));
    },
    inject: [loggerServiceToken, seed_service_1.SeedService, ...connectionTokens],
});
exports.DbObpsServiceFactory = DbObpsServiceFactory;
//# sourceMappingURL=db-ops.service.js.map