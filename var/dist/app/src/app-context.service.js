import { __decorate } from "tslib";
import { Injectable } from '@nestjs/common';
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
AppContextService = __decorate([
    Injectable()
], AppContextService);
export { AppContextService };
//# sourceMappingURL=app-context.service.js.map