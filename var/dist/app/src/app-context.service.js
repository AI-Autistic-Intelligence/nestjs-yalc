"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let AppContextService = class AppContextService {
    constructor() {
        this.initializedApps = new Set();
    }
    setSchema(schema) {
        this.graphQLSchema = schema;
    }
    get schema() {
        return this.graphQLSchema;
    }
};
exports.AppContextService = AppContextService;
exports.AppContextService = AppContextService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppContextService);
//# sourceMappingURL=app-context.service.js.map