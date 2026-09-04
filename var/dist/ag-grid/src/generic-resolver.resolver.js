import { __decorate, __metadata, __param } from "tslib";
export * from './generic-mutation.resolver';
export * from './generic-query.resolver';
export * from './generic-resolver.type';
import { Resolver } from '@nestjs/graphql';
import { GenericService, getServiceToken, } from '@nestjs-yalc/ag-grid/generic-service.service';
import { getDataloaderToken, GQLDataLoader, } from '@nestjs-yalc/data-loader/dataloader.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Inject } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { getEntityRelations } from "./ag-grid-metadata.helper";
import { defineCreateMutation, defineDeleteMutation, defineUpdateMutation } from "./generic-mutation.resolver";
import { defineFieldResolver, defineGetGridResource, defineGetSingleResource } from "./generic-query.resolver";
import { isCustomSingleQueryOptions } from "./generic-resolver.type";
import { getAgGridFieldMetadataList } from './object.decorator';
export function resolverFactory(options) {
    var _a, _b;
    const returnType = options.dto ?? options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.contextId = ContextIdFactory.create();
            this.moduleRef;
        }
    };
    BaseClass = __decorate([
        Resolver(returnValue(returnType), { isAbstract: true }),
        __param(0, Inject(options.service?.serviceToken ?? getServiceToken(options.entityModel))),
        __param(1, Inject(options.service?.dataLoaderToken ??
            getDataloaderToken(options.entityModel))),
        __metadata("design:paramtypes", [typeof (_a = typeof GenericService !== "undefined" && GenericService) === "function" ? _a : Object, typeof (_b = typeof GQLDataLoader !== "undefined" && GQLDataLoader) === "function" ? _b : Object, ModuleRef])
    ], BaseClass);
    const resolverInfoList = getEntityRelations(options.entityModel, options.dto);
    const fieldMetadataList = getAgGridFieldMetadataList(returnType);
    if (fieldMetadataList) {
        Object.keys(fieldMetadataList).forEach((propertyName) => {
            const field = fieldMetadataList[propertyName];
            if (!field.relation)
                return;
            const objIndex = resolverInfoList.findIndex((obj) => {
                if (obj.join) {
                    return obj.join.propertyName === propertyName;
                }
                else {
                    return;
                }
            });
            if (objIndex >= 0) {
                const relInfo = resolverInfoList[objIndex];
                const target = field.relation.targetKey.alias;
                resolverInfoList[objIndex] = {
                    ...relInfo,
                    join: {
                        ...relInfo.join,
                        propertyName,
                        name: field.relation.sourceKey.alias,
                        target,
                        referencedColumnName: target,
                    },
                    relation: {
                        ...relInfo.relation,
                        propertyName,
                        relationType: field.relation.relationType,
                        type: field.relation.type,
                        target: options.entityModel,
                    },
                    agField: {
                        ...relInfo.agField,
                        ...field,
                    },
                };
            }
            else {
                const target = field.relation.targetKey.alias;
                const dataLoaderRelation = {
                    join: {
                        propertyName,
                        name: field.relation.sourceKey.alias,
                        target,
                        referencedColumnName: target,
                    },
                    relation: {
                        propertyName,
                        relationType: field.relation.relationType,
                        type: field.relation.type,
                        isLazy: true,
                        target: options.entityModel,
                        options: {},
                    },
                    agField: field,
                };
                resolverInfoList.push(dataLoaderRelation);
            }
        });
    }
    const createOptions = options.mutations?.createResource ?? {};
    const updateOptions = options.mutations?.updateResource ?? {};
    const deleteOptions = options.mutations?.deleteResource ?? {};
    let Mutations = class Mutations extends BaseClass {
    };
    Mutations = __decorate([
        Resolver(returnValue(returnType), {
            isAbstract: true,
        })
    ], Mutations);
    defineCreateMutation(`${options.prefix ?? ''}create${options.entityModel.name}`, returnType, Mutations, options, createOptions);
    defineUpdateMutation(`${options.prefix ?? ''}update${options.entityModel.name}`, returnType, Mutations, options, updateOptions);
    defineDeleteMutation(`${options.prefix ?? ''}delete${options.entityModel.name}`, returnType, Mutations, options, deleteOptions);
    const getResourceOptions = options.queries?.getResource ?? {};
    const getResourceGridOptions = options.queries?.getResourceGrid ?? {};
    let GenericResolver = class GenericResolver extends (options.readonly ? BaseClass : Mutations) {
    };
    GenericResolver = __decorate([
        Resolver(returnValue(returnType))
    ], GenericResolver);
    defineGetSingleResource(`${options.prefix ?? ''}get${options.entityModel.name}`, returnType, GenericResolver, getResourceOptions);
    defineGetGridResource(`${options.prefix ?? ''}get${options.entityModel.name}Grid`, returnType, GenericResolver, getResourceGridOptions);
    defineFieldResolver(resolverInfoList, GenericResolver);
    if (options.customQueries) {
        for (const methodName of Object.keys(options.customQueries)) {
            const queryName = methodName;
            const queryOptions = options.customQueries[methodName];
            if (isCustomSingleQueryOptions(queryOptions)) {
                defineGetSingleResource(queryName, returnType, GenericResolver, queryOptions);
            }
            else {
                defineGetGridResource(queryName, returnType, GenericResolver, queryOptions);
            }
        }
    }
    return GenericResolver;
}
//# sourceMappingURL=generic-resolver.resolver.js.map