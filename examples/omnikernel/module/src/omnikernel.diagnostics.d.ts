import type { DataSource } from 'typeorm';
export interface OmniKernelQueryPlanEvidence {
    dialect: 'sqlite' | 'postgres';
    recordGridPlan: readonly string[];
    relationSourcePlan: readonly string[];
    usesRecordGridIndex: boolean;
    usesRelationSourceIndex: boolean;
}
/**
 * Bounded operator evidence for the two high-fanout generated read shapes.
 * This is diagnostic-only: CRUD continues to use the normal TypeORM path.
 */
export declare function collectOmniKernelQueryPlanEvidence(dataSource: DataSource, sample: {
    scopeId: string;
    recordKind: string;
    recordStatus: string;
    sourceRecordId: string;
    relationKind: string;
    relationStatus: string;
}): Promise<OmniKernelQueryPlanEvidence>;
