"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIDArg = isIDArg;
exports.isExtraInputStrict = isExtraInputStrict;
exports.checkFinalId = checkFinalId;
exports.isCustomSingleQueryOptions = isCustomSingleQueryOptions;
exports.hasExtraArgs = hasExtraArgs;
exports.hasFilters = hasFilters;
exports.generateDecorators = generateDecorators;
exports.defineFieldResolver = defineFieldResolver;
exports.defineGetSingleResource = defineGetSingleResource;
exports.defineGetGridResource = defineGetGridResource;
exports.defineCreateMutation = defineCreateMutation;
exports.defineUpdateMutation = defineUpdateMutation;
exports.defineDeleteMutation = defineDeleteMutation;
exports.resolverFactory = resolverFactory;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const crud_gen_args_gql_decorator_js_1 = require("@nest-yalc-2/crud-gen/api-graphql/crud-gen-args-gql.decorator.js");
const common_1 = require("@nestjs/common");
const crud_gen_gql_interceptor_js_1 = require("@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interceptor.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const generic_service_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service.js");
const crud_gen_gql_type_js_1 = tslib_1.__importDefault(require("./crud-gen-gql.type.js"));
const dataloader_helper_js_1 = require("@nest-yalc-2/data-loader/dataloader.helper.js");
const core_1 = require("@nestjs/core");
const graphql_2 = require("@nestjs/graphql");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const object_decorator_js_1 = require("../object.decorator.js");
const crud_gen_error_js_1 = require("../crud-gen.error.js");
const gqlmapper_decorator_js_1 = require("@nest-yalc-2/crud-gen/api-graphql/gqlmapper.decorator.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const nest_decorator_js_1 = require("@nest-yalc-2/utils/nestjs/nest.decorator.js");
function isIDArg(arg) {
    return !!arg.name;
}
function isExtraInputStrict(input) {
    const casted = input;
    return !!casted.middleware;
}
function checkFinalId(finalId) {
    if (typeof finalId === 'undefined') {
        throw new Error("Can't have an undefined ID");
    }
}
function isCustomSingleQueryOptions(option) {
    return option.isSingleResource === true;
}
function hasExtraArgs(option) {
    return !!option.extraArgs;
}
function hasFilters(findOptions) {
    return ((findOptions.where &&
        Object.values(findOptions.where.filters).length > 0) ||
        (findOptions.order && Object.values(findOptions.order).length > 0));
}
function generateDecorators(methodFn, defaultName, typeFunc, options) {
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
function defineFieldResolver(resolverInfoList, resolver) {
    for (const resolverInfo of resolverInfoList) {
        let relType = (typeof resolverInfo.relation.type === 'function'
            ? resolverInfo.relation.type()
            : resolverInfo.relation.type) ?? resolverInfo.relation.target;
        if (typeof relType === 'string') {
            relType = resolverInfo.relation.target;
        }
        if (Array.isArray(relType)) {
            relType = relType[0];
        }
        else if (!relType) {
            throw new crud_gen_error_js_1.CrudGenError('relation type undefined');
        }
        const agGraphType = resolverInfo.agField?.gqlType?.() ?? relType;
        const isArrayGraphType = Array.isArray(agGraphType) ||
            (Array.isArray(resolverInfo.agField?.gqlType) &&
                resolverInfo.agField?.gqlType.length > 0);
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
                            throw new crud_gen_error_js_1.CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return isArrayGraphType ? parentRes : [parentRes, -1];
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_js_1.getDataloaderToken)(relType), core_1.ContextIdFactory.getByRequest(graphql_1.GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
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
            (0, graphql_1.ResolveField)((0, returnValue_js_1.default)(isArrayGraphType ? agGraphType : (0, crud_gen_gql_type_js_1.default)(relType)), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            if (!isArrayGraphType) {
                (0, common_1.UseInterceptors)(new crud_gen_gql_interceptor_js_1.CrudGenGqlInterceptor())(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            }
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, crud_gen_args_gql_decorator_js_1.CrudGenArgs)({
                fieldType: relType,
                entityType: relType,
                defaultValue: resolverInfo.agField?.relation?.defaultValue,
            })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            (0, nest_decorator_js_1.GetContext)()(resolver.prototype, resolverInfo.relation.propertyName, 2);
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
                            throw new crud_gen_error_js_1.CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return parentRes;
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_js_1.getDataloaderToken)(relType), core_1.ContextIdFactory.getByRequest(graphql_1.GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
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
            (0, graphql_1.ResolveField)((0, returnValue_js_1.default)(relType), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, crud_gen_args_gql_decorator_js_1.CrudGenArgsSingle)({ fieldType: relType, entityType: relType })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            (0, nest_decorator_js_1.GetContext)()(resolver.prototype, resolverInfo.relation.propertyName, 2);
            Reflect.metadata('design:paramtypes', [Object, Array, Object])(resolver.prototype, resolverInfo.relation.propertyName);
        }
    }
}
function defineGetSingleResource(queryName, returnType, resolver, methodOptions) {
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_1.Query, queryName, methodOptions.returnType ?? (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_js_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, crud_gen_args_gql_decorator_js_1.CrudGenArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 0);
    (0, nest_decorator_js_1.GetContext)()(resolver.prototype, queryName, 1);
    if (methodOptions.idName && isIDArg(methodOptions.idName)) {
        if (!methodOptions.idName.hidden) {
            (0, graphql_1.Args)(methodOptions.idName.name, {
                nullable: false,
                type: (0, returnValue_js_1.default)(String),
            })(resolver.prototype, queryName, 2);
        }
    }
    else {
        (0, graphql_1.Args)(methodOptions.idName ?? 'ID', {
            nullable: false,
            type: (0, returnValue_js_1.default)(String),
        })(resolver.prototype, queryName, 2);
    }
    Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, queryName);
}
function defineGetGridResource(queryName, returnType, resolver, methodOptions) {
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
                throw new crud_gen_error_js_1.CrudGenError('Structured GraphQL filters require an extended repository; plain TypeORM fallback only supports basic grid queries.');
            }
            return service.getEntityListExtended(findOptions, true);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...generateDecorators(graphql_1.Query, queryName, methodOptions.returnType ??
        (0, returnValue_js_1.default)((0, crud_gen_gql_type_js_1.default)(returnType)), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, common_1.UseInterceptors)(new crud_gen_gql_interceptor_js_1.CrudGenGqlInterceptor())(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_js_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    const extraArgTypes = [];
    if (hasExtraArgs(methodOptions)) {
        (0, crud_gen_args_gql_decorator_js_1.CrudGenArgs)({
            fieldType,
            entityType,
            extraArgs: methodOptions.extraArgs,
            extraArgsStrategy: methodOptions.extraArgsStrategy,
        })(resolver.prototype, queryName, 0);
        if (methodOptions.extraArgs) {
            Object.values(methodOptions.extraArgs).map((a) => {
                if (!a.hidden)
                    extraArgTypes.push((0, crud_gen_helpers_js_1.filterTypeToNativeType)(a.filterType));
            });
        }
    }
    else {
        (0, crud_gen_args_gql_decorator_js_1.CrudGenArgs)({
            fieldType,
            entityType,
        })(resolver.prototype, queryName, 0);
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
function defineCreateMutation(queryName, returnType, resolver, options, methodOptions) {
    const extraInputs = methodOptions.extraInputs;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (input, findOptions, ctx, extraInputsArgs) {
            const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_2.Mutation, queryName, methodOptions.returnType ?? (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        gql: {
            type: () => options.input?.create ?? returnType,
        },
        fieldType: options.input?.create ?? returnType,
        _name: 'input',
    })(resolver.prototype, queryName, 0);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_js_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, crud_gen_args_gql_decorator_js_1.CrudGenArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 1);
    (0, nest_decorator_js_1.GetContext)()(resolver.prototype, queryName, 2);
    if (extraInputs) {
        Object.keys(extraInputs).forEach((k, i) => {
            const extraInputObj = extraInputs[k];
            if (!extraInputObj.gqlOptions)
                return;
            (0, gqlmapper_decorator_js_1.InputArgs)({
                gql: extraInputObj.gqlOptions,
                fieldType: extraInputObj.gqlOptions.type,
                _name: k,
            })(resolver.prototype, queryName, 3 + i);
        });
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
function defineUpdateMutation(queryName, returnType, resolver, options, methodOptions) {
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_2.Mutation, `${options.prefix ?? ''}update${options.entityModel.name}`, methodOptions.returnType ?? (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        fieldType: options.input?.update ?? returnType,
        gql: {
            type: () => options.input?.update ?? returnType,
        },
        _name: 'input',
    })(resolver.prototype, queryName, 1);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_js_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, crud_gen_args_gql_decorator_js_1.CrudGenArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 2);
    Reflect.metadata('design:paramtypes', [Object, Object])(resolver.prototype, queryName);
}
function defineDeleteMutation(queryName, returnType, resolver, options, methodOptions) {
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_2.Mutation, queryName, (0, returnValue_js_1.default)(Boolean), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
function resolverFactory(options) {
    const returnType = options.dto ?? options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.moduleRef;
        }
    };
    BaseClass = tslib_1.__decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType), { isAbstract: true }),
        tslib_1.__param(0, (0, common_1.Inject)(options.service?.serviceToken ?? (0, generic_service_js_1.getServiceToken)(options.entityModel))),
        tslib_1.__param(1, (0, common_1.Inject)(options.service?.dataLoaderToken ??
            (0, dataloader_helper_js_1.getDataloaderToken)(options.entityModel))),
        tslib_1.__param(2, (0, common_1.Inject)(options.moduleRefToken ?? core_1.ModuleRef)),
        tslib_1.__metadata("design:paramtypes", [generic_service_js_1.GenericService,
            dataloader_helper_js_1.GQLDataLoader,
            core_1.ModuleRef])
    ], BaseClass);
    const resolverInfoList = (0, crud_gen_helpers_js_1.getEntityRelations)(options.entityModel, options.dto);
    const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(returnType);
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
    Mutations = tslib_1.__decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType), {
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
    GenericResolver = tslib_1.__decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType))
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