"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxApp = void 0;
const http_adapters_1 = require("../transports/http-adapters");
const decorators_1 = require("../routing/decorators");
const sentinel_integration_1 = require("../security/sentinel-integration");
class FerroxApp {
    constructor(options = {}) {
        const engineType = options.engine || 'fastify';
        this.adapter = engineType === 'express' ? new http_adapters_1.ExpressHttpAdapter() : new http_adapters_1.FastifyHttpAdapter();
        this.port = options.port || 8080;
        this.host = options.host || '0.0.0.0';
        this.controllers = options.controllers || [];
        this.globalGuards = options.globalGuards || [];
        this.sentinel = new sentinel_integration_1.FerroxSentinelSecurityEngine(options.sentinelSecretKey);
        this.registerControllers();
    }
    registerControllers() {
        for (const controllerInstance of this.controllers) {
            const meta = (0, decorators_1.getControllerMetadata)(controllerInstance);
            const prefix = meta.prefix;
            for (const routeMeta of meta.routes) {
                const fullPath = (prefix + routeMeta.path).replace(/\/+/g, '/');
                const handlerFn = controllerInstance[routeMeta.handlerName].bind(controllerInstance);
                const routeDef = {
                    method: routeMeta.method,
                    path: fullPath,
                    handler: async (req, res) => {
                        for (const guard of this.globalGuards) {
                            const allowed = await guard.canActivate(req, res);
                            if (!allowed)
                                return;
                        }
                        for (const guard of routeMeta.guards) {
                            const allowed = await guard.canActivate(req, res);
                            if (!allowed)
                                return;
                        }
                        return await handlerFn(req, res);
                    },
                };
                this.adapter.registerRoute(routeDef);
            }
        }
    }
    async start() {
        console.log(`\n================================================================`);
        console.log(`🚀 Ferrox Enterprise Node.js / TypeScript Security Framework v0.6.0`);
        console.log(`⚡ Engine: ${this.adapter.type.toUpperCase()} | Port: ${this.port}`);
        console.log(`🛡️ Sentinel AI & LSM Kernel Sandbox: ACTIVE`);
        console.log(`================================================================\n`);
        this.server = await this.adapter.listen(this.port, this.host);
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
        return this.server;
    }
    async shutdown() {
        console.log(`\n🛑 Gracefully shutting down Ferrox-Node Framework application...`);
        await this.adapter.close();
        console.log(`👋 Shutdown complete.`);
    }
}
exports.FerroxApp = FerroxApp;
//# sourceMappingURL=ferrox-app.js.map