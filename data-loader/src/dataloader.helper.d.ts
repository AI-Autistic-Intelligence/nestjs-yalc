import _DataLoader from 'dataloader';
import { FindAndCountResult } from '@nest-yalc-2/database/query-builder.helper.js';
import { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { ObjectLiteral } from 'typeorm';
import { FactoryProvider } from '@nestjs/common';
import { GenericService } from '@nest-yalc-2/crud-gen/typeorm/generic.service.js';
import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { type EventEmitter2 } from 'eventemitter2';
export type SearchKeyType<E, T = string> = [keyof E, T] | T | undefined;
export declare class GQLDataLoader<Entity extends Record<string, any> = any> {
    private readonly eventEmitter?;
    private count;
    private batchFn;
    private searchKey;
    private options;
    private dataLoaders;
    private keyMap;
    constructor(getFn: (findManyOptions: CrudGenFindManyOptions<Entity>) => Promise<FindAndCountResult<Entity>>, searchKey: keyof Entity, eventEmitter?: EventEmitter2 | undefined, options?: _DataLoader.Options<string, Entity[], string>);
    getSearchKey(): keyof Entity;
    private getDataloader;
    getCount(): number;
    loadOne(key: SearchKeyType<Entity>, findOptions: CrudGenFindManyOptions<Entity>, throwOnNotFound: boolean): Promise<Entity | null>;
    loadOne(key: SearchKeyType<Entity>, findOptions: CrudGenFindManyOptions<Entity>, throwOnNotFound?: false): Promise<Entity | null>;
    loadOneToMany(key: SearchKeyType<Entity>, findOptions: CrudGenFindManyOptions<Entity>, withCount: false): Promise<Entity[]>;
    loadOneToMany(key: SearchKeyType<Entity>, findOptions: CrudGenFindManyOptions<Entity>, withCount?: true): Promise<FindAndCountResult<Entity>>;
}
export declare const getFn: <Entity extends ObjectLiteral>(service: GenericService<Entity>) => (findManyOptions: CrudGenFindManyOptions) => Promise<[Entity[], number]>;
export declare function DataLoaderFactory<Entity extends Record<string, any>>(defaultSearchKey: keyof Entity, entity: ClassType, serviceToken?: string): FactoryProvider;
export declare function getDataloaderToken(entity: ClassType | string): string;
