import _DataLoader from 'dataloader';
import { FindAndCountResult } from '@nestjs-yalc/database/query-builder.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { FactoryProvider } from '@nestjs/common';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { ClassType } from '@nestjs-yalc/types/globals';
export type SearchKeyType<E, T = string> = [keyof E, T] | T | undefined;
export declare class GQLDataLoader<Entity extends Record<string, any> = any> {
    private readonly eventEmitter?;
    private count;
    private batchFn;
    private searchKey;
    private options;
    private dataLoaders;
    private keyMap;
    constructor(getFn: (findManyOptions: AgGridFindManyOptions<Entity>) => Promise<FindAndCountResult<Entity>>, searchKey: keyof Entity, eventEmitter?: EventEmitter2, options?: _DataLoader.Options<string, Entity[], string>);
    getSearchKey(): keyof Entity;
    private getDataloader;
    getCount(): number;
    loadOne(key: SearchKeyType<Entity>, findOptions: AgGridFindManyOptions<Entity>, throwOnNotFound: boolean): Promise<Entity | null>;
    loadOne(key: SearchKeyType<Entity>, findOptions: AgGridFindManyOptions<Entity>, throwOnNotFound?: false): Promise<Entity | null>;
    loadOneToMany(key: SearchKeyType<Entity>, findOptions: AgGridFindManyOptions<Entity>, withCount: false): Promise<Entity[]>;
    loadOneToMany(key: SearchKeyType<Entity>, findOptions: AgGridFindManyOptions<Entity>, withCount?: true): Promise<FindAndCountResult<Entity>>;
}
export declare const getFn: <Entity extends Record<string, any>>(service: GenericService<Entity>) => (findManyOptions: AgGridFindManyOptions) => Promise<any>;
export declare function DataLoaderFactory<Entity extends Record<string, any>>(defaultSearchKey: keyof Entity, entity: ClassType, serviceToken?: string): FactoryProvider;
export declare function getDataloaderToken(entity: ClassType | string): string;
