"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSyncStateProjection = exports.TaskSyncStateProjectionApi = exports.taskSyncStateProjectionDefinition = exports.taskSyncStateProjectionScope = exports.TASK_SYNC_STATE_KIND = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const omnikernel_module_1 = require("@nest-yalc-2/omnikernel-module");
const typeorm_1 = require("typeorm");
exports.TASK_SYNC_STATE_KIND = 'sync-state';
exports.taskSyncStateProjectionScope = {
    scopeId: 'default',
    cacheKey: (key) => `default:${key}`,
};
exports.taskSyncStateProjectionDefinition = (0, crud_gen_1.defineProjectionResource)({
    id: 'task-system.sync-state.v1',
    tableName: 'omni-record',
    identity: { column: 'guid', uniqueWithinScope: true },
    scope: { column: 'scopeId', serverOwned: true },
    revision: { column: 'revision' },
    payload: { column: 'payload', allowCreate: false },
    deletion: 'hard',
    fields: [
        {
            name: 'guid',
            storage: 'column',
            column: 'guid',
            codec: 'uuid',
            nullable: false,
            requiredOnCreate: true,
        },
        {
            name: 'externalRefId',
            storage: 'json',
            path: ['externalRefId'],
            codec: 'uuid',
            nullable: false,
            requiredOnCreate: true,
            query: { filter: ['eq'], sort: true },
            index: { name: 'task_sync_state_external_ref_idx' },
        },
        {
            name: 'status',
            storage: 'json',
            path: ['syncStatus'],
            codec: 'string',
            nullable: false,
            requiredOnCreate: true,
            query: { filter: ['eq'], sort: true },
            index: { name: 'task_sync_state_status_idx' },
        },
        {
            name: 'lastSyncedAt',
            storage: 'json',
            path: ['lastSyncedAt'],
            codec: 'instant',
            nullable: true,
            query: { filter: ['eq', 'range'], sort: true },
            index: { name: 'task_sync_state_last_synced_at_idx' },
        },
        {
            name: 'lastDirection',
            storage: 'json',
            path: ['lastDirection'],
            codec: 'string',
            nullable: true,
            query: { filter: ['eq'], sort: true },
        },
        {
            name: 'remoteVersion',
            storage: 'json',
            path: ['remoteVersion'],
            codec: 'string',
            nullable: true,
            query: { filter: ['eq'], sort: true },
        },
        {
            name: 'localVersionHash',
            storage: 'json',
            path: ['localVersionHash'],
            codec: 'string',
            nullable: true,
            query: { filter: ['eq'], sort: true },
        },
        {
            name: 'lastError',
            storage: 'json',
            path: ['lastError'],
            codec: 'string',
            nullable: true,
        },
    ],
});
class TaskSyncStateProjectionApi {
}
exports.TaskSyncStateProjectionApi = TaskSyncStateProjectionApi;
let TaskSyncStateProjection = class TaskSyncStateProjection extends omnikernel_module_1.OmniRecordEntity {
    constructor() {
        super(...arguments);
        this.kind = exports.TASK_SYNC_STATE_KIND;
        this.status = omnikernel_module_1.OmniRecordStatus.Active;
        this.title = 'Sync state';
    }
};
exports.TaskSyncStateProjection = TaskSyncStateProjection;
exports.TaskSyncStateProjection = TaskSyncStateProjection = __decorate([
    (0, typeorm_1.ChildEntity)(exports.TASK_SYNC_STATE_KIND)
], TaskSyncStateProjection);
//# sourceMappingURL=task-sync-state.projection.js.map