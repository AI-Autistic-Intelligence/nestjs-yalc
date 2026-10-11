/**
 * Generated REST mappers instantiate DTOs directly. Keep server-owned scope
 * and lifecycle fields out of that copy so REST and GraphQL expose the same
 * public contract.
 */
export declare function assignOmniPublicDto<T extends object>(target: T, data: object): void;
