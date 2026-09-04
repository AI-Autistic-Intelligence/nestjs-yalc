"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const skeleton_cron_module_1 = require("./skeleton-cron.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(skeleton_cron_module_1.SkeletonCronModule);
    await app.listen(3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map