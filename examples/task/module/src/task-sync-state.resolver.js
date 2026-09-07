"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSyncStateProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const task_sync_state_dto_js_1 = require("./task-sync-state.dto.js");
const task_sync_state_entity_js_1 = require("./task-sync-state.entity.js");
const taskSyncStateProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: task_sync_state_entity_js_1.TaskSyncState,
    resolver: {
        dto: task_sync_state_dto_js_1.TaskSyncStateType,
        input: {
            create: task_sync_state_dto_js_1.TaskSyncStateCreateInput,
            update: task_sync_state_dto_js_1.TaskSyncStateUpdateInput,
            conditions: task_sync_state_dto_js_1.TaskSyncStateCondition,
        },
        prefix: 'TaskSystem_',
    },
    service: {
        dbConnection,
        entityModel: task_sync_state_entity_js_1.TaskSyncState,
    },
    dataloader: { databaseKey: 'guid' },
});
exports.taskSyncStateProvidersFactory = taskSyncStateProvidersFactory;
//# sourceMappingURL=task-sync-state.resolver.js.map