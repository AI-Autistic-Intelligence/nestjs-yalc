"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedServiceFactory = exports.SeedService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const seed_service_1 = require("@node-yalc/database/seed.service");
let SeedService = class SeedService extends seed_service_1.SeedService {
    constructor(dbConnections, loggerService, configService, configPath) {
        super(dbConnections, loggerService, configService, configPath);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Array, Object, config_1.ConfigService, String])
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