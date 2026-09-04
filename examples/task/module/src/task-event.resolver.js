"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskEventProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers.js");
const task_event_dto_js_1 = require("./task-event.dto.js");
const task_event_entity_js_1 = require("./task-event.entity.js");
const taskEventProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: task_event_entity_js_1.TaskEvent,
    resolver: {
        dto: task_event_dto_js_1.TaskEventType,
        input: {
            create: task_event_dto_js_1.TaskEventCreateInput,
            update: task_event_dto_js_1.TaskEventUpdateInput,
            conditions: task_event_dto_js_1.TaskEventCondition,
        },
        prefix: 'TaskSystem_',
    },
    service: {
        dbConnection,
        entityModel: task_event_entity_js_1.TaskEvent,
    },
    dataloader: { databaseKey: 'guid' },
});
exports.taskEventProvidersFactory = taskEventProvidersFactory;
//# sourceMappingURL=task-event.resolver.js.map