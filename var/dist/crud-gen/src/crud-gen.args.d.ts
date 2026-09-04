import { ClassType } from '@nestjs-yalc/types/globals.d.js';
import { ICrudGenBaseParams } from './api-graphql/crud-gen-gql.interface.js';
export declare const typeMap: WeakMap<WeakKey, any>;
export declare function crudGenParamsFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
export declare function crudGenParamsNoPaginationFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
