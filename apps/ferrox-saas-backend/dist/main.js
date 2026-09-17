"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const index_1 = require("../../../ferrox-node/dist/index");
const health_controller_1 = require("./modules/health.controller");
const auth_controller_1 = require("./modules/auth.controller");
const users_controller_1 = require("./modules/users.controller");
const admin_controller_1 = require("./modules/admin.controller");
const founder_controller_1 = require("./modules/founder.controller");
const admin_dashboard_controller_1 = require("./modules/admin-dashboard.controller");
const founder_dashboard_controller_1 = require("./modules/founder-dashboard.controller");
async function bootstrap(engine = 'fastify', port = 8080) {
    const app = new index_1.FerroxApp({
        engine,
        port,
        globalGuards: [new index_1.MandatoryComplianceGuard()],
        controllers: [
            new health_controller_1.HealthController(),
            new auth_controller_1.AuthController(),
            new users_controller_1.UsersController(),
            new admin_controller_1.AdminController(),
            new founder_controller_1.FounderController(),
            new admin_dashboard_controller_1.AdminDashboardController(),
            new founder_dashboard_controller_1.FounderDashboardController(),
        ],
    });
    return await app.start();
}
if (require.main === module) {
    bootstrap('fastify', 8080);
}
