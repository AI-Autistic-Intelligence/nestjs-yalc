export * from './generic-mutation.resolver';
export * from './generic-query.resolver';
export * from './generic-resolver.type';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { ModuleRef } from '@nestjs/core';
import { ObjectLiteral } from 'typeorm';
import { GenericResolver, GenericResolverOptions } from "./generic-resolver.type";
export declare function resolverFactory<Entity extends Record<string, any> = any, EntityWrite extends ObjectLiteral = Entity>(options: GenericResolverOptions<Entity>): {
    new (service: GenericService<Entity, EntityWrite>, dataloader: GQLDataLoader<Entity>, moduleRef: ModuleRef): GenericResolver;
};
