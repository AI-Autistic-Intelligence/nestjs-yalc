import { __decorate, __metadata, __param } from "tslib";
import { Args, GqlExecutionContext, Parent, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { CrudGenArgs, CrudGenArgsSingle, } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-args-gql.decorator.js';
import { applyDecorators, Inject, UseInterceptors, } from '@nestjs/common';
import { CrudGenGqlInterceptor } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interceptor.js';
import returnValue from '@nestjs-yalc/utils/returnValue.js';
import { GenericService, getServiceToken, } from '@nestjs-yalc/crud-gen/typeorm/generic.service.js';
import CrudGenGqlType from './crud-gen-gql.type.js';
import { getDataloaderToken, GQLDataLoader, } from '@nestjs-yalc/data-loader/dataloader.helper.js';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Mutation } from '@nestjs/graphql';
import { filterTypeToNativeType, getEntityRelations, } from '../crud-gen.helpers.js';
import { getModelFieldMetadataList } from '../object.decorator.js';
import { CrudGenError } from '../crud-gen.error.js';
import { InputArgs } from '@nestjs-yalc/crud-gen/api-graphql/gqlmapper.decorator.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { GetContext } from '@nestjs-yalc/utils/nest.decorator.js';
export function isIDArg(arg) {
    return !!arg.name;
}
export function isExtraInputStrict(input) {
    const casted = input;
    return !!casted.middleware;
}
export function checkFinalId(finalId) {
    if (typeof finalId === 'undefined') {
        throw new Error("Can't have an undefined ID");
    }
}
export function isCustomSingleQueryOptions(option) {
    return option.isSingleResource === true;
}
export function hasExtraArgs(option) {
    return !!option.extraArgs;
}
export function hasFilters(findOptions) {
    return ((findOptions.where &&
        Object.values(findOptions.where.filters).length > 0) ||
        (findOptions.order && Object.values(findOptions.order).length > 0));
}
export function generateDecorators(methodFn, defaultName, typeFunc, options) {
    if (options?.disabled)
        return [];
    return [
        ...(options?.decorators ?? []),
        methodFn(typeFunc, {
            ...options?.queryParams,
            name: options?.queryParams?.name ?? defaultName,
        }),
    ];
}
export function defineFieldResolver(resolverInfoList, resolver) {
    for (const resolverInfo of resolverInfoList) {
        let relType = (typeof resolverInfo.relation.type === 'function'
            ? resolverInfo.relation.type()
            : resolverInfo.relation.type) ?? resolverInfo.agField?.gqlType?.();
        if (Array.isArray(relType)) {
            relType = relType[0];
        }
        else if (!relType) {
            throw new CrudGenError('relation type undefined');
        }
        if (resolverInfo.relation.relationType === 'one-to-many' ||
            resolverInfo.relation.relationType === 'many-to-many') {
            const agGraphType = resolverInfo.agField?.gqlType?.();
            const isArrayGraphType = Array.isArray(agGraphType);
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions, context) {
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if (hasFilters(findOptions))
                            throw new CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return isArrayGraphType ? parentRes : [parentRes, -1];
                    }
                    const dataLoader = await this.moduleRef.resolve(getDataloaderToken(relType), ContextIdFactory.getByRequest(GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
                    const joinCol = resolverInfo.agField?.relation?.targetKey.alias ??
                        resolverInfo.join?.referencedColumnName ??
                        dataLoader.getSearchKey();
                    const parentCol = resolverInfo.agField?.relation?.sourceKey.alias ??
                        resolverInfo.join?.name ??
                        dataLoader.getSearchKey();
                    const result = await dataLoader.loadOneToMany([joinCol, parent[parentCol]], findOptions, true);
                    return isArrayGraphType ? result[0] : result;
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            ResolveField(returnValue(isArrayGraphType ? agGraphType : CrudGenGqlType(relType)), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            if (!isArrayGraphType) {
                UseInterceptors(new CrudGenGqlInterceptor())(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            }
            Parent()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            CrudGenArgs({
                fieldType: relType,
                entityType: relType,
                defaultValue: resolverInfo.agField?.relation?.defaultValue,
            })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            GetContext()(resolver.prototype, resolverInfo.relation.propertyName, 2);
            Reflect.metadata('design:paramtypes', [Object, Object, Object])(resolver.prototype, resolverInfo.relation.propertyName);
        }
        else {
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions, context) {
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if (hasFilters(findOptions))
                            throw new CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return parentRes;
                    }
                    const dataLoader = await this.moduleRef.resolve(getDataloaderToken(relType), ContextIdFactory.getByRequest(GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
                    const joinCol = resolverInfo.agField?.relation?.targetKey.alias ??
                        resolverInfo.join?.referencedColumnName ??
                        dataLoader.getSearchKey();
                    const parentCol = resolverInfo.agField?.relation?.sourceKey.alias ??
                        resolverInfo.join?.name ??
                        dataLoader.getSearchKey();
                    return dataLoader.loadOne([joinCol, parent[parentCol]], findOptions, false);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            ResolveField(returnValue(relType), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            Parent()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            CrudGenArgsSingle({ fieldType: relType, entityType: relType })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            GetContext()(resolver.prototype, resolverInfo.relation.propertyName, 2);
            Reflect.metadata('design:paramtypes', [Object, Array, Object])(resolver.prototype, resolverInfo.relation.propertyName);
        }
    }
}
export function defineGetSingleResource(queryName, returnType, resolver, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (findOptions, ctx, id) {
            const dataLoader = this.dataLoader;
            let finalId;
            if (methodOptions.idName && isIDArg(methodOptions.idName)) {
                finalId = methodOptions.idName.filterMiddleware
                    ? methodOptions.idName.filterMiddleware(ctx, id)
                    : id;
            }
            else {
                finalId = id;
            }
            checkFinalId(finalId);
            return dataLoader.loadOne([dataLoader.getSearchKey(), finalId], findOptions, methodOptions.throwOnNotFound ?? false);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    applyDecorators(...generateDecorators(Query, queryName, methodOptions.returnType ?? returnValue(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !isClass(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    CrudGenArgsSingle({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 0);
    GetContext()(resolver.prototype, queryName, 1);
    if (methodOptions.idName && isIDArg(methodOptions.idName)) {
        if (!methodOptions.idName.hidden) {
            Args(methodOptions.idName.name, {
                nullable: false,
                type: returnValue(String),
            })(resolver.prototype, queryName, 2);
        }
    }
    else {
        Args(methodOptions.idName ?? 'ID', {
            nullable: false,
            type: returnValue(String),
        })(resolver.prototype, queryName, 2);
    }
    Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, queryName);
}
export function defineGetGridResource(queryName, returnType, resolver, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (findOptions) {
            const service = this.service;
            const where = findOptions?.where;
            const hasStructuredFilters = !!where &&
                typeof where === 'object' &&
                ((typeof where.filters === 'object' &&
                    Object.keys(where.filters ?? {}).length > 0) ||
                    'operator' in where ||
                    'expressions' in where ||
                    'childExpressions' in where);
            const supportsStructuredGraphqlFilters = typeof service.supportsStructuredGraphqlFilters === 'function'
                ? !!service.supportsStructuredGraphqlFilters()
                : !!service.supportsExtendedRepository();
            if (hasStructuredFilters && !supportsStructuredGraphqlFilters) {
                throw new CrudGenError('Structured GraphQL filters require an extended repository; plain TypeORM fallback only supports basic grid queries.');
            }
            return service.getEntityListExtended(findOptions, true);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    applyDecorators(...generateDecorators(Query, queryName, methodOptions.returnType ??
        returnValue(CrudGenGqlType(returnType)), methodOptions))(resolver.prototype, queryName, descriptor);
    UseInterceptors(new CrudGenGqlInterceptor())(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !isClass(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    const extraArgTypes = [];
    if (hasExtraArgs(methodOptions)) {
        CrudGenArgs({
            fieldType,
            entityType,
            extraArgs: methodOptions.extraArgs,
            extraArgsStrategy: methodOptions.extraArgsStrategy,
        })(resolver.prototype, queryName, 0);
        if (methodOptions.extraArgs) {
            Object.values(methodOptions.extraArgs).map((a) => {
                if (!a.hidden)
                    extraArgTypes.push(filterTypeToNativeType(a.filterType));
            });
        }
    }
    else {
        CrudGenArgs({
            fieldType,
            entityType,
        })(resolver.prototype, queryName, 0);
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
export function defineCreateMutation(queryName, returnType, resolver, options, methodOptions) {
    const extraInputs = methodOptions.extraInputs;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (input, findOptions, ctx, extraInputsArgs) {
            const gqlCtx = GqlExecutionContext.create(ctx);
            if (extraInputs)
                Object.keys(extraInputs).forEach((k) => {
                    const extraInputObj = extraInputs[k];
                    if (isExtraInputStrict(extraInputObj)) {
                        if (!extraInputsArgs) {
                            extraInputsArgs = {};
                        }
                        extraInputsArgs[k] = extraInputObj.middleware(gqlCtx, input, extraInputsArgs[k]);
                    }
                });
            return this.service.createEntity(input, findOptions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    applyDecorators(...generateDecorators(Mutation, queryName, methodOptions.returnType ?? returnValue(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    InputArgs({
        gql: {
            type: () => options.input?.create ?? returnType,
        },
        fieldType: options.input?.create ?? returnType,
        _name: 'input',
    })(resolver.prototype, queryName, 0);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !isClass(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    CrudGenArgsSingle({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 1);
    GetContext()(resolver.prototype, queryName, 2);
    if (extraInputs) {
        Object.keys(extraInputs).forEach((k, i) => {
            const extraInputObj = extraInputs[k];
            if (!extraInputObj.gqlOptions)
                return;
            InputArgs({
                gql: extraInputObj.gqlOptions,
                fieldType: extraInputObj.gqlOptions.type,
                _name: k,
            })(resolver.prototype, queryName, 3 + i);
        });
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
export function defineUpdateMutation(queryName, returnType, resolver, options, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (conditions, input, findOptions) {
            return this.service.updateEntity(conditions, input, findOptions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    applyDecorators(...generateDecorators(Mutation, `${options.prefix ?? ''}update${options.entityModel.name}`, methodOptions.returnType ?? returnValue(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    InputArgs({
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    InputArgs({
        fieldType: options.input?.update ?? returnType,
        gql: {
            type: () => options.input?.update ?? returnType,
        },
        _name: 'input',
    })(resolver.prototype, queryName, 1);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !isClass(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    CrudGenArgsSingle({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 2);
    Reflect.metadata('design:paramtypes', [Object, Object])(resolver.prototype, queryName);
}
export function defineDeleteMutation(queryName, returnType, resolver, options, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (conditions) {
            return this.service.deleteEntity(conditions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    applyDecorators(...generateDecorators(Mutation, queryName, returnValue(Boolean), methodOptions))(resolver.prototype, queryName, descriptor);
    InputArgs({
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
export function resolverFactory(options) {
    const returnType = options.dto ?? options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.moduleRef;
        }
    };
    BaseClass = __decorate([
        Resolver(returnValue(returnType), { isAbstract: true }),
        __param(0, Inject(options.service?.serviceToken ?? getServiceToken(options.entityModel))),
        __param(1, Inject(options.service?.dataLoaderToken ??
            getDataloaderToken(options.entityModel))),
        __param(2, Inject(options.moduleRefToken ?? ModuleRef)),
        __metadata("design:paramtypes", [GenericService,
            GQLDataLoader,
            ModuleRef])
    ], BaseClass);
    const resolverInfoList = getEntityRelations(options.entityModel, options.dto);
    const fieldMetadataList = getModelFieldMetadataList(returnType);
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
//# sourceMappingURL=generic.resolver.js.map