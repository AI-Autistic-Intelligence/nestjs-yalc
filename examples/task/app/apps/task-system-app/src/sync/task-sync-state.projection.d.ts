import { type ProjectionScope } from '@nestjs-yalc/crud-gen';
import { OmniRecordEntity, OmniRecordStatus } from '@nestjs-yalc/omnikernel-module';
export declare const TASK_SYNC_STATE_KIND = "sync-state";
export declare const taskSyncStateProjectionScope: ProjectionScope;
export declare const taskSyncStateProjectionDefinition: Readonly<{
    id: string;
    tableName: string;
    identity: {
        column: string;
        uniqueWithinScope: true;
    };
    scope: {
        column: string;
        serverOwned: true;
    };
    revision: {
        column: string;
    };
    payload: {
        column: string;
        allowCreate: false;
    };
    deletion: "hard";
    fields: ({
        name: string;
        storage: "column";
        column: string;
        codec: "uuid";
        nullable: false;
        requiredOnCreate: true;
        path?: undefined;
        query?: undefined;
        index?: undefined;
    } | {
        name: string;
        storage: "json";
        path: string[];
        codec: "uuid";
        nullable: false;
        requiredOnCreate: true;
        query: {
            filter: "eq"[];
            sort: true;
        };
        index: {
            name: string;
        };
        column?: undefined;
    } | {
        name: string;
        storage: "json";
        path: string[];
        codec: "string";
        nullable: false;
        requiredOnCreate: true;
        query: {
            filter: "eq"[];
            sort: true;
        };
        index: {
            name: string;
        };
        column?: undefined;
    } | {
        name: string;
        storage: "json";
        path: string[];
        codec: "instant";
        nullable: true;
        query: {
            filter: ("range" | "eq")[];
            sort: true;
        };
        index: {
            name: string;
        };
        column?: undefined;
        requiredOnCreate?: undefined;
    } | {
        name: string;
        storage: "json";
        path: string[];
        codec: "string";
        nullable: true;
        query: {
            filter: "eq"[];
            sort: true;
        };
        column?: undefined;
        requiredOnCreate?: undefined;
        index?: undefined;
    } | {
        name: string;
        storage: "json";
        path: string[];
        codec: "string";
        nullable: true;
        column?: undefined;
        requiredOnCreate?: undefined;
        query?: undefined;
        index?: undefined;
    })[];
}>;
export declare class TaskSyncStateProjectionApi {
    guid: string;
    externalRefId: string;
    status: string;
    lastSyncedAt?: string | null;
    lastDirection?: string | null;
    remoteVersion?: string | null;
    localVersionHash?: string | null;
    lastError?: string | null;
    revision: number;
    payload?: Record<string, unknown>;
}
export declare class TaskSyncStateProjection extends OmniRecordEntity {
    kind: string;
    status: OmniRecordStatus;
    title: string;
}
