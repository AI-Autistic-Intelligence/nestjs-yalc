"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionRelation = exports.ProjectionRecord = void 0;
exports.createProjectionRecordSchema = createProjectionRecordSchema;
exports.createProjectionRelationSchema = createProjectionRelationSchema;
exports.createProjectionSpikeDialect = createProjectionSpikeDialect;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const typeorm_1 = require("typeorm");
const projection_spike_definition_1 = require("./projection-spike.definition");
class ProjectionRecord {
}
exports.ProjectionRecord = ProjectionRecord;
class ProjectionRelation {
}
exports.ProjectionRelation = ProjectionRelation;
function createProjectionRecordSchema(dialect) {
    const projectionSchema = (0, crud_gen_1.createProjectionSchemaOptions)(projection_spike_definition_1.projectionRecordDefinition, dialect);
    return new typeorm_1.EntitySchema({
        name: projection_spike_definition_1.projectionRecordDefinition.tableName,
        tableName: projection_spike_definition_1.projectionRecordDefinition.tableName,
        target: ProjectionRecord,
        columns: Object.assign({ id: { type: Number, primary: true, generated: true } }, projectionSchema.columns),
        indices: projectionSchema.indices,
    });
}
function createProjectionRelationSchema() {
    return new typeorm_1.EntitySchema({
        name: 'projection_spike_relation',
        tableName: 'projection_spike_relation',
        target: ProjectionRelation,
        columns: {
            id: { type: Number, primary: true, generated: true },
            scopeId: { type: String, length: 64 },
            guid: { type: String, length: 64 },
            sourceGuid: { type: String, length: 64 },
            targetGuid: { type: String, length: 64 },
            kind: { type: String, length: 64 },
        },
        indices: [
            {
                name: 'projection_spike_relation_scope_guid_unique',
                columns: ['scopeId', 'guid'],
                unique: true,
            },
            {
                name: 'projection_spike_relation_source_idx',
                columns: ['scopeId', 'sourceGuid', 'kind', 'guid'],
            },
            {
                name: 'projection_spike_relation_target_idx',
                columns: ['scopeId', 'targetGuid', 'kind', 'guid'],
            },
        ],
    });
}
function createProjectionSpikeDialect(driver) {
    return (0, crud_gen_1.createProjectionDialect)(driver);
}
//# sourceMappingURL=projection-spike.entities.js.map