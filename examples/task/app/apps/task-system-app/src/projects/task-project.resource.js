"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskProjectProviders = exports.ProjectsController = exports.taskProjectResource = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const generic_service_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const task_project_entity_1 = require("@nest-yalc-2/task-system-module/src/task-project.entity");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const task_app_omni_project_service_1 = require("../omni-task-app/task-app-omni-project.service");
const task_project_dto_1 = require("./task-project.dto");
exports.taskProjectResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: task_project_entity_1.TaskProject,
    backend: {
        service: {
            provider: {
                provide: (0, generic_service_1.getServiceToken)(task_project_entity_1.TaskProject),
                useExisting: task_app_omni_project_service_1.TaskAppOmniProjectService,
            },
        },
        dataloader: {
            provider: {
                provide: (0, data_loader_1.getDataloaderToken)(task_project_entity_1.TaskProject),
                useFactory: (service) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid'),
                inject: [(0, generic_service_1.getServiceToken)(task_project_entity_1.TaskProject)],
            },
        },
    },
    graphql: {
        resolver: {
            dto: task_project_dto_1.TaskProjectType,
            input: {
                create: task_project_dto_1.TaskProjectCreateInput,
                update: task_project_dto_1.TaskProjectUpdateInput,
                conditions: task_project_dto_1.TaskProjectCondition,
            },
            prefix: 'TaskSystem_',
        },
    },
    rest: {
        dto: task_project_dto_1.TaskProjectType,
        path: 'projects',
        idField: 'guid',
    },
});
exports.ProjectsController = exports.taskProjectResource.controllers[0];
exports.taskProjectProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.taskProjectResource.providers);
//# sourceMappingURL=task-project.resource.js.map