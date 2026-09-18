"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectOmniKernelQueryPlanEvidence = collectOmniKernelQueryPlanEvidence;
const recordGridIndex = 'omni_record_scope_kind_status_guid_idx';
const relationSourceIndex = 'omni_relation_scope_source_kind_status_created_guid_idx';
async function collectOmniKernelQueryPlanEvidence(dataSource, sample) {
    const dialect = dataSource.options.type;
    if (dialect !== 'sqlite' && dialect !== 'postgres') {
        throw new TypeError('OmniKernel diagnostics support sqlite and postgres only.');
    }
    const statements = dialect === 'sqlite'
        ? {
            record: `EXPLAIN QUERY PLAN SELECT "guid" FROM "omni-record" WHERE "scopeId" = ? AND "kind" = ? AND "status" = ? AND "deletedAt" IS NULL ORDER BY "guid"`,
            relation: `EXPLAIN QUERY PLAN SELECT "guid" FROM "omni-relation" WHERE "scopeId" = ? AND "sourceRecordId" = ? AND "kind" = ? AND "status" = ? ORDER BY "createdAt", "guid"`,
        }
        : {
            record: `EXPLAIN (FORMAT JSON) SELECT "guid" FROM "omni-record" WHERE "scopeId" = $1 AND "kind" = $2 AND "status" = $3 AND "deletedAt" IS NULL ORDER BY "guid"`,
            relation: `EXPLAIN (FORMAT JSON) SELECT "guid" FROM "omni-relation" WHERE "scopeId" = $1 AND "sourceRecordId" = $2 AND "kind" = $3 AND "status" = $4 ORDER BY "createdAt", "guid"`,
        };
    const recordResult = await dataSource.query(statements.record, [
        sample.scopeId,
        sample.recordKind,
        sample.recordStatus,
    ]);
    const relationResult = await dataSource.query(statements.relation, [
        sample.scopeId,
        sample.sourceRecordId,
        sample.relationKind,
        sample.relationStatus,
    ]);
    const recordGridPlan = flattenPlan(recordResult);
    const relationSourcePlan = flattenPlan(relationResult);
    return {
        dialect,
        recordGridPlan,
        relationSourcePlan,
        usesRecordGridIndex: containsIndex(recordGridPlan, recordGridIndex),
        usesRelationSourceIndex: containsIndex(relationSourcePlan, relationSourceIndex),
    };
}
function flattenPlan(result) {
    return JSON.stringify(result)
        .replaceAll('\\n', ' ')
        .split(/(?<=\}),|\n/)
        .filter((line) => line.length > 0);
}
function containsIndex(plan, indexName) {
    return plan.some((line) => line.includes(indexName));
}
//# sourceMappingURL=omnikernel.diagnostics.js.map