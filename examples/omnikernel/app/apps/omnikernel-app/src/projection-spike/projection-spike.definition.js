"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectionRelationDefinition = exports.projectionRecordDefinition = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
exports.projectionRecordDefinition = (0, crud_gen_1.defineProjectionResource)({
    id: 'omnikernel.projection-spike.record.v1',
    tableName: 'projection_spike_record',
    identity: { column: 'guid', uniqueWithinScope: true },
    scope: { column: 'scopeId', serverOwned: true },
    revision: { column: 'revision' },
    payload: { column: 'payload', allowCreate: true },
    deletion: 'hard',
    fields: [
        {
            name: 'guid',
            storage: 'column',
            column: 'guid',
            codec: 'string',
            nullable: false,
            requiredOnCreate: true,
        },
        {
            name: 'title',
            storage: 'column',
            column: 'title',
            codec: 'string',
            nullable: false,
            requiredOnCreate: true,
            query: { filter: ['eq'], sort: true },
        },
        {
            name: 'status',
            storage: 'json',
            path: ['workflow', 'status'],
            codec: 'string',
            nullable: false,
            requiredOnCreate: true,
            query: { filter: ['eq'], sort: true },
            index: { name: 'projection_spike_record_status_idx' },
        },
        {
            name: 'plannedEnd',
            storage: 'json',
            path: ['workflow', 'plan', 'end'],
            codec: 'instant',
            nullable: true,
            query: { filter: ['eq', 'range'], sort: true },
            index: { name: 'projection_spike_record_planned_end_idx' },
        },
        {
            name: 'priority',
            storage: 'json',
            path: ['workflow', 'priority'],
            codec: 'integer',
            nullable: true,
            query: { filter: ['eq', 'range'], sort: true },
            index: { name: 'projection_spike_record_priority_idx' },
        },
    ],
});
exports.projectionRelationDefinition = {
    identity: 'guid',
    scope: 'scopeId',
    source: 'sourceGuid',
    target: 'targetGuid',
    fields: ['guid', 'sourceGuid', 'targetGuid', 'kind'],
    mutableFields: ['kind'],
    deletion: 'hard',
};
//# sourceMappingURL=projection-spike.definition.js.map