export declare const projectionRecordDefinition: Readonly<{
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
        allowCreate: true;
    };
    deletion: "hard";
    fields: ({
        name: string;
        storage: "column";
        column: string;
        codec: "string";
        nullable: false;
        requiredOnCreate: true;
        query?: undefined;
        path?: undefined;
        index?: undefined;
    } | {
        name: string;
        storage: "column";
        column: string;
        codec: "string";
        nullable: false;
        requiredOnCreate: true;
        query: {
            filter: "eq"[];
            sort: true;
        };
        path?: undefined;
        index?: undefined;
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
        codec: "integer";
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
    })[];
}>;
export declare const projectionRelationDefinition: {
    readonly identity: "guid";
    readonly scope: "scopeId";
    readonly source: "sourceGuid";
    readonly target: "targetGuid";
    readonly fields: readonly ["guid", "sourceGuid", "targetGuid", "kind"];
    readonly mutableFields: readonly ["kind"];
    readonly deletion: "hard";
};
