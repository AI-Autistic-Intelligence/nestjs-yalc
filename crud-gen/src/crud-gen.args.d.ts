import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { ICrudGenBaseParams } from './api-graphql/crud-gen-gql.interface.js';
export declare const typeMap: WeakMap<object, any>;
export declare function crudGenParamsFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
export declare function crudGenParamsNoPaginationFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
