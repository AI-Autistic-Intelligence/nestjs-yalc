import type { CrudGenFindManyOptions, ICrudGenGqlArgsOptions } from '../api-graphql/crud-gen-gql.interface.js';
import { GenericService } from '../typeorm/generic.service.js';
import type { ClassType } from '@nest-yalc-2/types/globals.d.js';
import type { IDecoratorType } from '@nest-yalc-2/interfaces';
import { type ODataQueryParams } from './odata-query.interface.js';
export interface CrudRestMutationOptions {
    disabled?: boolean;
    decorators?: IDecoratorType[];
}
export interface CrudRestMutationsOptions {
    create?: CrudRestMutationOptions;
    update?: CrudRestMutationOptions;
    delete?: CrudRestMutationOptions;
}
export interface CrudRestControllerOptions<Entity extends Record<string, any>> {
    entityModel: ClassType<Entity>;
    dto?: ClassType<any>;
    serialize?: boolean;
    path?: string;
    serviceToken?: string | symbol;
    query?: ICrudGenGqlArgsOptions;
    idField?: keyof Entity & string;
    odata?: {
        allowedExpands?: string[];
    };
    decorators?: IDecoratorType[];
    readonly?: boolean;
    mutations?: CrudRestMutationsOptions;
}
export declare function crudRestControllerFactory<Entity extends Record<string, any>>(options: CrudRestControllerOptions<Entity>): {
    new (service: GenericService<Entity>): {
        readonly service: GenericService<Entity>;
        list(rawQuery: Record<string, unknown>, findOptions: CrudGenFindManyOptions<Entity>): Promise<Entity[] | [Entity[], number]>;
        getById(id: string): Promise<Entity>;
        create(body: Partial<Entity>): Promise<Entity>;
        update(id: string, body: Partial<Entity>): Promise<Entity>;
        remove(id: string): Promise<{
            deleted: boolean;
        }>;
        mapQuery(rawQuery: Record<string, unknown>, legacy: CrudGenFindManyOptions<Entity>): {
            options: CrudGenFindManyOptions<Entity>;
            withCount: boolean;
        };
        hasODataParams(rawQuery: Record<string, unknown>): boolean;
        mapODataToFindOptions(params: ODataQueryParams): CrudGenFindManyOptions<Entity>;
    };
};
