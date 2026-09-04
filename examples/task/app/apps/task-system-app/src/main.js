"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
async function bootstrap() {
    var _a;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map