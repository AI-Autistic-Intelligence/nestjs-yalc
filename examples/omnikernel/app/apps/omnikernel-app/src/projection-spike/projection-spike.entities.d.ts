import { type ProjectionDialect } from '@nest-yalc-2/crud-gen';
import { EntitySchema } from 'typeorm';
export declare class ProjectionRecord {
    id: number;
    scopeId: string;
    guid: string;
    title: string;
    revision: number;
    payload: Record<string, unknown>;
    status?: string;
    plannedEnd?: string | null;
    priority?: number | null;
}
export declare class ProjectionRelation {
    id: number;
    scopeId: string;
    guid: string;
    sourceGuid: string;
    targetGuid: string;
    kind: string;
}
export declare function createProjectionRecordSchema(dialect: ProjectionDialect): EntitySchema<ProjectionRecord>;
export declare function createProjectionRelationSchema(): EntitySchema<ProjectionRelation>;
export declare function createProjectionSpikeDialect(driver: 'sqlite' | 'postgres'): ProjectionDialect;
