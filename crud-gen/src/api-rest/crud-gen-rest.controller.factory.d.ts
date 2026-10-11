import type { CrudGenFindManyOptions, ICrudGenGqlArgsOptions } from '../api-graphql/crud-gen-gql.interface.js';
import { GenericService } from '../typeorm/generic.service.js';
import type { ClassType } from '@node-yalc/types/globals.js';
import type { IDecoratorType } from '@node-yalc/interfaces';
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
export interface CrudRestControllerOptions<Entity extends Record<string, unknown>> {
    entityModel: ClassType<Entity>;
    /**
     * DTO used to serialize output. Defaults to `entityModel`.
     */
    dto?: ClassType<any>;
    /**
     * Apply Nest's class-transformer serialization after DTO mapping.
     * Enable this when the DTO uses @Exclude/@Expose to define a public surface.
     */
    serialize?: boolean;
    /**
     * Optional path override. Defaults to the entity name in kebab-case.
     */
    path?: string;
    /**
     * Token used to resolve the service. Defaults to `getServiceToken(entityModel)`.
     */
    serviceToken?: string | symbol;
    /**
     * Customize query args mapping (sorting, defaults, extra args...).
     */
    query?: ICrudGenGqlArgsOptions;
    /**
     * Field used for `GET :id`. Defaults to `id`.
     */
    idField?: keyof Entity & string;
    /**
     * OData-like façade options.
     * - allowedExpands: validate $expand values against this allowlist.
     */
    odata?: {
        allowedExpands?: string[];
    };
    decorators?: IDecoratorType[];
    /**
     * When true, only read endpoints are generated (GET list + GET :id).
     * Write endpoints (POST/PUT/DELETE) are omitted.
     */
    readonly?: boolean;
    /**
     * Fine-grained control over write endpoints.
     * If `readonly` is true these are ignored.
     */
    mutations?: CrudRestMutationsOptions;
}
export declare function crudRestControllerFactory<Entity extends Record<string, unknown>>(options: CrudRestControllerOptions<Entity>): {
    new (service: GenericService<Entity>): {
        readonly service: GenericService<Entity>;
        list(rawQuery: Record<string, unknown>, findOptions: CrudGenFindManyOptions<Entity>): Promise<Entity[] | [Entity[], number]>;
        getById(id: string): Promise<Entity>;
        /**
         * Create a new resource.
         * The request body is treated as a partial Entity payload.
         */
        create(body: Partial<Entity>): Promise<Entity>;
        /**
         * Update an existing resource by idField.
         */
        update(id: string, body: Partial<Entity>): Promise<Entity>;
        /**
         * Delete an existing resource by idField.
         */
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
