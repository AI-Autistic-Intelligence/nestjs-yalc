"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectionSpikeTestApp = createProjectionSpikeTestApp;
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const projection_spike_definition_1 = require("./projection-spike.definition");
const projection_spike_module_1 = require("./projection-spike.module");
async function createProjectionSpikeTestApp(options) {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [projection_spike_module_1.ProjectionSpikeAppModule.register(options)],
    }).compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    await (0, crud_gen_1.applyProjectionIndexesForBootstrap)(app.get((0, typeorm_1.getDataSourceToken)()), app.get(projection_spike_module_1.PROJECTION_SPIKE_DIALECT), projection_spike_definition_1.projectionRecordDefinition);
    return app;
}
//# sourceMappingURL=projection-spike-test-app.js.map