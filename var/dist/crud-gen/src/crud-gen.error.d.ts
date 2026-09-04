import { GqlError } from '@nestjs-yalc/graphql/plugins/gql.error.js';
export declare class CrudGenError extends GqlError {
    systemMessage?: string | undefined;
    constructor(message?: string, systemMessage?: string | undefined);
}
export declare class CrudGenInvalidArgumentError extends CrudGenError {
    constructor();
}
export declare class CrudGenInvalidOperatorError extends CrudGenError {
    constructor();
}
export declare class CrudGenInvalidPropertyError extends CrudGenError {
    constructor();
}
export declare class CrudGenConditionNotSupportedError extends CrudGenError {
    constructor(info?: string);
}
export declare class CrudGenFilterNotSupportedError extends CrudGenError {
    constructor(info?: string);
}
export declare class CrudGenBadFilterTypeError extends CrudGenError {
    constructor();
}
export declare class CrudGenNotPossibleError extends CrudGenError {
    constructor();
}
export declare class CrudGenStringWhereError extends CrudGenError {
    constructor();
}
export declare class CrudGenFilterProhibited extends CrudGenError {
    constructor();
}
