"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExternalRefProviders = exports.ExternalRefsController = exports.taskExternalRefResource = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const generic_service_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const task_external_ref_entity_1 = require("@nest-yalc-2/task-system-module/src/task-external-ref.entity");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const task_app_omni_external_ref_service_1 = require("../omni-task-app/task-app-omni-external-ref.service");
const task_external_ref_dto_1 = require("./task-external-ref.dto");
exports.taskExternalRefResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: task_external_ref_entity_1.TaskExternalRef,
    backend: {
        service: {
            provider: {
                provide: (0, generic_service_1.getServiceToken)(task_external_ref_entity_1.TaskExternalRef),
                useExisting: task_app_omni_external_ref_service_1.TaskAppOmniExternalRefService,
            },
        },
        dataloader: {
            provider: {
                provide: (0, data_loader_1.getDataloaderToken)(task_external_ref_entity_1.TaskExternalRef),
                useFactory: (service) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid'),
                inject: [(0, generic_service_1.getServiceToken)(task_external_ref_entity_1.TaskExternalRef)],
            },
        },
    },
    graphql: {
        resolver: {
            dto: task_external_ref_dto_1.TaskExternalRefType,
            input: {
                create: task_external_ref_dto_1.TaskExternalRefCreateInput,
                update: task_external_ref_dto_1.TaskExternalRefUpdateInput,
                conditions: task_external_ref_dto_1.TaskExternalRefCondition,
            },
            prefix: 'TaskSystem_',
        },
    },
    rest: {
        dto: task_external_ref_dto_1.TaskExternalRefType,
        path: 'external-refs',
        idField: 'guid',
    },
});
exports.ExternalRefsController = exports.taskExternalRefResource.controllers[0];
exports.taskExternalRefProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.taskExternalRefResource.providers);
//# sourceMappingURL=task-external-ref.resource.js.map