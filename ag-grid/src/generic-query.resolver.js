"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFieldResolver = defineFieldResolver;
exports.defineGetSingleResource = defineGetSingleResource;
exports.defineGetGridResource = defineGetGridResource;
const dataloader_helper_1 = require("@nestjs-yalc/data-loader/dataloader.helper");
const class_helper_1 = require("@nestjs-yalc/utils/class.helper");
const nest_decorator_1 = require("@nestjs-yalc/utils/nest.decorator");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_error_1 = require("./ag-grid.error");
const ag_grid_interceptor_1 = require("./ag-grid.interceptor");
const ag_grid_type_1 = __importDefault(require("./ag-grid.type"));
const generic_resolver_type_1 = require("./generic-resolver.type");
function defineFieldResolver(resolverInfoList, resolver) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    for (const resolverInfo of resolverInfoList) {
        let relType = (_a = (typeof resolverInfo.relation.type === 'function'
            ? resolverInfo.relation.type()
            : resolverInfo.relation.type)) !== null && _a !== void 0 ? _a : (_c = (_b = resolverInfo.agField) === null || _b === void 0 ? void 0 : _b.gqlType) === null || _c === void 0 ? void 0 : _c.call(_b);
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
                    var _a, _b, _c, _d;
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if ((0, generic_resolver_type_1.hasFilters)(findOptions))
                            throw new ag_grid_error_1.AgGridError('Cannot specify join arguments and resolver arguments at the same time');
                        return [parentRes, -1];
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_1.getDataloaderToken)(relType), this.contextId);
                    const joinCol = (_b = (_a = resolverInfo.join) === null || _a === void 0 ? void 0 : _a.referencedColumnName) !== null && _b !== void 0 ? _b : dataLoader.getSearchKey();
                    const parentCol = (_d = (_c = resolverInfo.join) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : dataLoader.getSearchKey();
                    return dataLoader.loadOneToMany([joinCol, parent[parentCol]], findOptions, true);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_1.default)((0, ag_grid_type_1.default)(relType)), {
                nullable: (_e = (_d = resolverInfo.agField) === null || _d === void 0 ? void 0 : _d.gqlOptions) === null || _e === void 0 ? void 0 : _e.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, common_1.UseInterceptors)(new ag_grid_interceptor_1.AgGridInterceptor())(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, ag_grid_args_decorator_1.AgGridArgs)({
                fieldType: relType,
                entityType: relType,
                defaultValue: (_g = (_f = resolverInfo.agField) === null || _f === void 0 ? void 0 : _f.relation) === null || _g === void 0 ? void 0 : _g.defaultValue,
            })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            Reflect.metadata('design:paramtypes', [Object, Object])(resolver.prototype, resolverInfo.relation.propertyName);
        }
        else {
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions) {
                    var _a, _b, _c, _d;
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if ((0, generic_resolver_type_1.hasFilters)(findOptions))
                            throw new ag_grid_error_1.AgGridError('Cannot specify join arguments and resolver arguments at the same time');
                        return parentRes;
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_1.getDataloaderToken)(relType), this.contextId);
                    const joinCol = (_b = (_a = resolverInfo.join) === null || _a === void 0 ? void 0 : _a.referencedColumnName) !== null && _b !== void 0 ? _b : dataLoader.getSearchKey();
                    const parentCol = (_d = (_c = resolverInfo.join) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : dataLoader.getSearchKey();
                    return dataLoader.loadOne([joinCol, parent[parentCol]], findOptions, false);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_1.default)(relType), {
                nullable: (_j = (_h = resolverInfo.agField) === null || _h === void 0 ? void 0 : _h.gqlOptions) === null || _j === void 0 ? void 0 : _j.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, ag_grid_args_decorator_1.AgGridArgsSingle)({ fieldType: relType, entityType: relType })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, resolverInfo.relation.propertyName);
        }
    }
}
function defineGetSingleResource(queryName, returnType, resolver, methodOptions) {
    var _a, _b, _c, _d;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (findOptions, ctx, id) {
            var _a;
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
            return dataLoader.loadOne([dataLoader.getSearchKey(), finalId], findOptions, (_a = methodOptions.throwOnNotFound) !== null && _a !== void 0 ? _a : false);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(common_1.Query, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    const fieldType = (_c = (_b = methodOptions.returnType) === null || _b === void 0 ? void 0 : _b.call(methodOptions)) !== null && _c !== void 0 ? _c : returnType;
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
        (0, graphql_1.Args)((_d = methodOptions.idName) !== null && _d !== void 0 ? _d : 'ID', {
            nullable: false,
            type: (0, returnValue_1.default)(String),
        })(resolver.prototype, queryName, 2);
    }
    Reflect.metadata('design:paramtypes', [Object, Array])(resolver.prototype, queryName);
}
function defineGetGridResource(queryName, returnType, resolver, methodOptions) {
    var _a, _b, _c;
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
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(common_1.Query, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_1.default)((0, ag_grid_type_1.default)(returnType)), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, common_1.UseInterceptors)(new ag_grid_interceptor_1.AgGridInterceptor())(resolver.prototype, queryName, descriptor);
    const fieldType = (_c = (_b = methodOptions.returnType) === null || _b === void 0 ? void 0 : _b.call(methodOptions)) !== null && _c !== void 0 ? _c : returnType;
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