import { ClassType } from '@nest-yalc-2/types';
import { RelationInfo } from './ag-grid-factory.helper';
import { GenericResolver, GenericResolverQueryOptions } from './generic-resolver.type';
export declare function defineFieldResolver<Entity extends Record<string, any> = any>(resolverInfoList: RelationInfo[], resolver: ClassType<GenericResolver>): void;
export declare function defineGetSingleResource<Entity extends Record<string, any>>(queryName: string, returnType: ClassType, resolver: ClassType<GenericResolver>, methodOptions: GenericResolverQueryOptions): void;
export declare function defineGetGridResource<Entity extends Record<string, any>>(queryName: string, returnType: ClassType, resolver: ClassType<GenericResolver>, methodOptions: GenericResolverQueryOptions): void;
