"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskProjectProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const task_project_dto_js_1 = require("./task-project.dto.js");
const task_project_entity_js_1 = require("./task-project.entity.js");
const taskProjectProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: task_project_entity_js_1.TaskProject,
    resolver: {
        dto: task_project_dto_js_1.TaskProjectType,
        input: {
            create: task_project_dto_js_1.TaskProjectCreateInput,
            update: task_project_dto_js_1.TaskProjectUpdateInput,
            conditions: task_project_dto_js_1.TaskProjectCondition,
        },
        prefix: 'TaskSystem_',
    },
    service: {
        dbConnection,
        entityModel: task_project_entity_js_1.TaskProject,
    },
    dataloader: { databaseKey: 'guid' },
});
exports.taskProjectProvidersFactory = taskProjectProvidersFactory;
//# sourceMappingURL=task-project.resolver.js.map