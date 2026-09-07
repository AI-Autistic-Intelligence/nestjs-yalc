import { GqlError } from '@nest-yalc-2/graphql/plugins/gql.error';
export declare class AgGridError extends GqlError {
    systemMessage?: string | undefined;
    constructor(message?: string, systemMessage?: string | undefined);
}
export declare class AgGridInvalidArgumentError extends AgGridError {
    constructor();
}
export declare class AgGridInvalidOperatorError extends AgGridError {
    constructor();
}
export declare class AgGridInvalidPropertyError extends AgGridError {
    constructor();
}
export declare class AgGridConditionNotSupportedError extends AgGridError {
    constructor(info?: string);
}
export declare class AgGridFilterNotSupportedError extends AgGridError {
    constructor(info?: string);
}
export declare class AgGridBadFilterTypeError extends AgGridError {
    constructor();
}
export declare class AgGridNotPossibleError extends AgGridError {
    constructor();
}
export declare class AgGridStringWhereError extends AgGridError {
    constructor();
}
export declare class AgGridFilterProhibited extends AgGridError {
    constructor();
}
