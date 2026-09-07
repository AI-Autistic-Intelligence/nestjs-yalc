"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSyncStateProviders = exports.SyncStatesController = exports.taskSyncStateResource = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const generic_service_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const task_sync_state_projection_service_1 = require("./task-sync-state-projection.service");
const task_sync_state_projection_1 = require("./task-sync-state.projection");
const taskSyncStateGraphqlTypes = (0, crud_gen_1.createProjectionGraphqlTypes)(task_sync_state_projection_1.taskSyncStateProjectionDefinition, {
    object: 'TaskSyncStateType',
    create: 'TaskSyncStateCreateInput',
    patch: 'TaskSyncStateUpdateInput',
    conditions: 'TaskSyncStateCondition',
});
exports.taskSyncStateResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: task_sync_state_projection_1.TaskSyncStateProjectionApi,
    backend: false,
    graphql: {
        resolver: {
            dto: taskSyncStateGraphqlTypes.object,
            input: {
                create: taskSyncStateGraphqlTypes.create,
                update: taskSyncStateGraphqlTypes.patch,
                conditions: taskSyncStateGraphqlTypes.conditions,
            },
            prefix: 'TaskSystem_',
            queries: {
                getResource: {
                    idName: 'guid',
                    queryParams: { name: 'TaskSystem_getTaskSyncState' },
                },
                getResourceGrid: {
                    queryParams: { name: 'TaskSystem_getTaskSyncStateGrid' },
                },
            },
            mutations: {
                createResource: {
                    queryParams: { name: 'TaskSystem_createTaskSyncState' },
                },
                updateResource: {
                    queryParams: { name: 'TaskSystem_updateTaskSyncState' },
                },
                deleteResource: {
                    queryParams: { name: 'TaskSystem_deleteTaskSyncState' },
                },
            },
        },
        serviceToken: (0, generic_service_1.getServiceToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi),
        dataLoaderToken: (0, data_loader_1.getDataloaderToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi),
    },
    rest: {
        dto: taskSyncStateGraphqlTypes.object,
        path: 'sync-states',
        idField: 'guid',
        serviceToken: (0, generic_service_1.getServiceToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi),
    },
});
exports.SyncStatesController = exports.taskSyncStateResource.controllers[0];
exports.taskSyncStateProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)([
    {
        provide: task_sync_state_projection_service_1.TASK_SYNC_STATE_PROJECTION_SCOPE,
        useValue: task_sync_state_projection_1.taskSyncStateProjectionScope,
    },
    {
        provide: task_sync_state_projection_service_1.TASK_SYNC_STATE_PROJECTION_DIALECT,
        useValue: (0, crud_gen_1.createProjectionDialect)('sqlite'),
    },
    task_sync_state_projection_service_1.TaskSyncStateProjectionIndexesBootstrap,
    task_sync_state_projection_service_1.TaskSyncStateProjectionService,
    {
        provide: (0, generic_service_1.getServiceToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi),
        useExisting: task_sync_state_projection_service_1.TaskSyncStateProjectionService,
    },
    {
        provide: (0, data_loader_1.getDataloaderToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi),
        useFactory: (service) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', undefined, {
            cacheKeyFn: (key) => task_sync_state_projection_1.taskSyncStateProjectionScope.cacheKey(key),
        }),
        inject: [(0, generic_service_1.getServiceToken)(task_sync_state_projection_1.TaskSyncStateProjectionApi)],
    },
    ...exports.taskSyncStateResource.providers,
]);
//# sourceMappingURL=task-sync-state.resource.js.map