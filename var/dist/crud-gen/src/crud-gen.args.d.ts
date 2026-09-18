import { ClassType } from '@node-yalc/types/globals';
import { ICrudGenBaseParams } from './api-graphql/crud-gen-gql.interface.js';
export declare const typeMap: WeakMap<object, any>;
export declare function crudGenParamsFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
export declare function crudGenParamsNoPaginationFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
