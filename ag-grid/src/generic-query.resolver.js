"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFieldResolver = defineFieldResolver;
exports.defineGetSingleResource = defineGetSingleResource;
exports.defineGetGridResource = defineGetGridResource;
const dataloader_helper_1 = require("@nest-yalc-2/data-loader/dataloader.helper");
const class_helper_1 = require("@nest-yalc-2/utils/class.helper");
const nest_decorator_1 = require("@nest-yalc-2/utils/nest.decorator");
const returnValue_1 = __importDefault(require("@nest-yalc-2/utils/returnValue"));
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_error_1 = require("./ag-grid.error");
const ag_grid_interceptor_1 = require("./ag-grid.interceptor");
const ag_grid_type_1 = __importDefault(require("./ag-grid.type"));
const generic_resolver_type_1 = require("./generic-resolver.type");
function defineFieldResolver(resolverInfoList, resolver) {
    for (const resolverInfo of resolverInfoList) {
        let relType = (typeof resolverInfo.relation.type === 'function'
            ? resolverInfo.relation.type()
            : resolverInfo.relation.type) ?? resolverInfo.agField?.gqlType?.();
        if (Array.isArray(relType)) {
            relType = relType[0];
        }
        else if (!relType) {
            throw new ag_grid_error_1.AgGridError('relation type undefined');
        }
        if (resolverInfo.relation.relationType === 'one-to-many' ||
            resolverInfo.relation.relationType === 'many-to-many') {
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions) {
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if ((0, generic_resolver_type_1.hasFilters)(findOptions))
                            throw new ag_grid_error_1.AgGridError('Cannot specify join arguments and resolver arguments at the same time');
                        return [parentRes, -1];
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_1.getDataloaderToken)(relType), this.contextId);
                    const joinCol = resolverInfo.join?.referencedColumnName ??
                        dataLoader.getSearchKey();
                    const parentCol = resolverInfo.join?.name ?? dataLoader.getSearchKey();
                    return dataLoader.loadOneToMany([joinCol, parent[parentCol]], findOptions, true);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_1.default)((0, ag_grid_type_1.default)(relType)), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, common_1.UseInterceptors)(new ag_grid_interceptor_1.AgGridInterceptor())(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, ag_grid_args_decorator_1.AgGridArgs)({
                fieldType: relType,
                entityType: relType,
                defaultValue: resolverInfo.agField?.relation?.defaultValue,
            })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            Reflect.metadata('design:paramtypes', [Object, Object])(resolver.prototype, resolverInfo.relation.propertyName);
        }
        else {
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions) {
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if ((0, generic_resolver_type_1.hasFilters)(findOptions))
                            throw new ag_grid_error_1.AgGridError('Cannot specify join arguments and resolver arguments at the same time');
                        return parentRes;
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_1.getDataloaderToken)(relType), this.contextId);
                    const joinCol = resolverInfo.join?.referencedColumnName ??
                        dataLoader.getSearchKey();
                    const parentCol = resolverInfo.join?.name ?? dataLoader.getSearchKey();
                    return dataLoader.loadOne([joinCol, parent[parentCol]], findOptions, false);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_1.default)(relType), {
                nullable: resolverInfo.agField?.gqlOptions?.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, ag_grid_args_decorator_1.AgGridArgsSingle)({ fieldType: relType, entityType: relType })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, resolverInfo.relation.propertyName);
        }
    }
}
function defineGetSingleResource(queryName, returnType, resolver, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (findOptions, ctx, id) {
            const dataLoader = this.dataLoader;
            const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
            let finalId;
            if (methodOptions.idName && (0, generic_resolver_type_1.isIDArg)(methodOptions.idName)) {
                finalId = methodOptions.idName.filterMiddleware
                    ? methodOptions.idName.filterMiddleware(gqlCtx, id)
                    : id;
            }
            else {
                finalId = id;
            }
            (0, generic_resolver_type_1.checkFinalId)(finalId);
            return dataLoader.loadOne([dataLoader.getSearchKey(), finalId], findOptions, methodOptions.throwOnNotFound ?? false);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(common_1.Query, queryName, methodOptions.returnType ?? (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, ag_grid_args_decorator_1.AgGridArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 0);
    (0, nest_decorator_1.GetContext)()(resolver.prototype, queryName, 1);
    if (methodOptions.idName && (0, generic_resolver_type_1.isIDArg)(methodOptions.idName)) {
        if (!methodOptions.idName.hidden) {
            (0, graphql_1.Args)(methodOptions.idName.name, {
                nullable: false,
                type: (0, returnValue_1.default)(String),
            })(resolver.prototype, queryName, 2);
        }
    }
    else {
        (0, graphql_1.Args)(methodOptions.idName ?? 'ID', {
            nullable: false,
            type: (0, returnValue_1.default)(String),
        })(resolver.prototype, queryName, 2);
    }
    Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, queryName);
}
function defineGetGridResource(queryName, returnType, resolver, methodOptions) {
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (findOptions) {
            return this.service.getEntityListAgGrid(findOptions, true);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(common_1.Query, queryName, methodOptions.returnType ??
        (0, returnValue_1.default)((0, ag_grid_type_1.default)(returnType)), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, common_1.UseInterceptors)(new ag_grid_interceptor_1.AgGridInterceptor())(resolver.prototype, queryName, descriptor);
    const fieldType = methodOptions.returnType?.() ?? returnType;
    const entityType = !(0, class_helper_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    const extraArgTypes = [];
    if ((0, generic_resolver_type_1.hasExtraArgs)(methodOptions)) {
        (0, ag_grid_args_decorator_1.AgGridArgs)({
            fieldType,
            entityType,
            extraArgs: methodOptions.extraArgs,
            extraArgsStrategy: methodOptions.extraArgsStrategy,
        })(resolver.prototype, queryName, 0);
        if (methodOptions.extraArgs) {
            Object.values(methodOptions.extraArgs).map((a) => {
                if (!a.hidden)
                    extraArgTypes.push((0, ag_grid_query_helper_1.filterTypeToNativeType)(a.filterType));
            });
        }
    }
    else {
        (0, ag_grid_args_decorator_1.AgGridArgs)({
            fieldType,
            entityType,
        })(resolver.prototype, queryName, 0);
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
//# sourceMappingURL=generic-query.resolver.js.map