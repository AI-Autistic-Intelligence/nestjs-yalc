"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskItemProviders = exports.TasksController = exports.taskItemResource = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const generic_service_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const task_item_entity_1 = require("@nest-yalc-2/task-system-module/src/task-item.entity");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const task_app_omni_task_service_1 = require("../omni-task-app/task-app-omni-task.service");
const task_item_dto_1 = require("./task-item.dto");
exports.taskItemResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: task_item_entity_1.TaskItem,
    backend: {
        service: {
            provider: {
                provide: (0, generic_service_1.getServiceToken)(task_item_entity_1.TaskItem),
                useExisting: task_app_omni_task_service_1.TaskAppOmniTaskService,
            },
        },
        dataloader: {
            provider: {
                provide: (0, data_loader_1.getDataloaderToken)(task_item_entity_1.TaskItem),
                useFactory: (service) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid'),
                inject: [(0, generic_service_1.getServiceToken)(task_item_entity_1.TaskItem)],
            },
        },
    },
    graphql: {
        resolver: {
            dto: task_item_dto_1.TaskItemType,
            input: {
                create: task_item_dto_1.TaskItemCreateInput,
                update: task_item_dto_1.TaskItemUpdateInput,
                conditions: task_item_dto_1.TaskItemCondition,
            },
            prefix: 'TaskSystem_',
        },
    },
    rest: {
        dto: task_item_dto_1.TaskItemType,
        path: 'tasks',
        idField: 'guid',
    },
});
exports.TasksController = exports.taskItemResource.controllers[0];
exports.taskItemProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.taskItemResource.providers);
//# sourceMappingURL=task-item.resource.js.map