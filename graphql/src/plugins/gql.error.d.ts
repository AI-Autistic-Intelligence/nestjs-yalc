export declare enum GqlErrorMsgs {
    MAX_OPERATIONS = "The request has too many operations.",
    MAX_DEPTH = "The request has reached the max depth allowed.",
    CIRCULAR_DEPENDENCY_FOUND = "The request has a circular dependency."
}
export declare class GqlError extends Error {
    systemMessage?: string | undefined;
    constructor(message?: string, systemMessage?: string | undefined);
}
