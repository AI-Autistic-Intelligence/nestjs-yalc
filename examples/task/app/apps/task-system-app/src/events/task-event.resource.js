"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskEventProviders = exports.EventsController = exports.taskEventResource = void 0;
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const generic_service_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.service");
const data_loader_1 = require("@nestjs-yalc/data-loader");
const task_event_entity_1 = require("@nestjs-yalc/task-system-module/src/task-event.entity");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const task_app_omni_event_service_1 = require("../omni-task-app/task-app-omni-event.service");
const task_event_dto_1 = require("./task-event.dto");
exports.taskEventResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: task_event_entity_1.TaskEvent,
    backend: {
        service: {
            provider: {
                provide: (0, generic_service_1.getServiceToken)(task_event_entity_1.TaskEvent),
                useExisting: task_app_omni_event_service_1.TaskAppOmniEventService,
            },
        },
        dataloader: {
            provider: {
                provide: (0, data_loader_1.getDataloaderToken)(task_event_entity_1.TaskEvent),
                useFactory: (service) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid'),
                inject: [(0, generic_service_1.getServiceToken)(task_event_entity_1.TaskEvent)],
            },
        },
    },
    graphql: {
        resolver: {
            dto: task_event_dto_1.TaskEventType,
            input: {
                create: task_event_dto_1.TaskEventCreateInput,
                update: task_event_dto_1.TaskEventUpdateInput,
                conditions: task_event_dto_1.TaskEventCondition,
            },
            prefix: 'TaskSystem_',
        },
    },
    rest: {
        dto: task_event_dto_1.TaskEventType,
        path: 'events',
        idField: 'guid',
    },
});
exports.EventsController = exports.taskEventResource.controllers[0];
exports.taskEventProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.taskEventResource.providers);
//# sourceMappingURL=task-event.resource.js.map