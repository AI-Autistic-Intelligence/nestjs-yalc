"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const graphql_1 = require("@nestjs/graphql");
const crud_gen_args_gql_decorator_js_1 = require("@nestjs-yalc/crud-gen/api-graphql/crud-gen-args-gql.decorator.js");
const common_1 = require("@nestjs/common");
const crud_gen_gql_interceptor_js_1 = require("@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interceptor.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const generic_service_js_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.service.js");
const crud_gen_gql_type_js_1 = __importDefault(require("./crud-gen-gql.type.js"));
const dataloader_helper_js_1 = require("@nestjs-yalc/data-loader/dataloader.helper.js");
const core_1 = require("@nestjs/core");
const graphql_2 = require("@nestjs/graphql");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const object_decorator_js_1 = require("../object.decorator.js");
const crud_gen_error_js_1 = require("../crud-gen.error.js");
const gqlmapper_decorator_js_1 = require("@nestjs-yalc/crud-gen/api-graphql/gqlmapper.decorator.js");
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
const nest_decorator_js_1 = require("@nestjs-yalc/utils/nestjs/nest.decorator.js");
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
    var _a, _b, _c;
    if (options === null || options === void 0 ? void 0 : options.disabled)
        return [];
    return [
        ...((_a = options === null || options === void 0 ? void 0 : options.decorators) !== null && _a !== void 0 ? _a : []),
        methodFn(typeFunc, Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.queryParams), { name: (_c = (_b = options === null || options === void 0 ? void 0 : options.queryParams) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : defaultName })),
    ];
}
function defineFieldResolver(resolverInfoList, resolver) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    for (const resolverInfo of resolverInfoList) {
        let relType = (_a = (typeof resolverInfo.relation.type === 'function'
            ? resolverInfo.relation.type()
            : resolverInfo.relation.type)) !== null && _a !== void 0 ? _a : (_c = (_b = resolverInfo.agField) === null || _b === void 0 ? void 0 : _b.gqlType) === null || _c === void 0 ? void 0 : _c.call(_b);
        if (Array.isArray(relType)) {
            relType = relType[0];
        }
        else if (!relType) {
            throw new crud_gen_error_js_1.CrudGenError('relation type undefined');
        }
        if (resolverInfo.relation.relationType === 'one-to-many' ||
            resolverInfo.relation.relationType === 'many-to-many') {
            const agGraphType = (_e = (_d = resolverInfo.agField) === null || _d === void 0 ? void 0 : _d.gqlType) === null || _e === void 0 ? void 0 : _e.call(_d);
            const isArrayGraphType = Array.isArray(agGraphType);
            Object.defineProperty(resolver.prototype, resolverInfo.relation.propertyName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: async function (parent, findOptions, context) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if (hasFilters(findOptions))
                            throw new crud_gen_error_js_1.CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return isArrayGraphType ? parentRes : [parentRes, -1];
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_js_1.getDataloaderToken)(relType), core_1.ContextIdFactory.getByRequest(graphql_1.GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
                    const joinCol = (_e = (_c = (_b = (_a = resolverInfo.agField) === null || _a === void 0 ? void 0 : _a.relation) === null || _b === void 0 ? void 0 : _b.targetKey.alias) !== null && _c !== void 0 ? _c : (_d = resolverInfo.join) === null || _d === void 0 ? void 0 : _d.referencedColumnName) !== null && _e !== void 0 ? _e : dataLoader.getSearchKey();
                    const parentCol = (_k = (_h = (_g = (_f = resolverInfo.agField) === null || _f === void 0 ? void 0 : _f.relation) === null || _g === void 0 ? void 0 : _g.sourceKey.alias) !== null && _h !== void 0 ? _h : (_j = resolverInfo.join) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : dataLoader.getSearchKey();
                    const result = await dataLoader.loadOneToMany([joinCol, parent[parentCol]], findOptions, true);
                    return isArrayGraphType ? result[0] : result;
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_js_1.default)(isArrayGraphType ? agGraphType : (0, crud_gen_gql_type_js_1.default)(relType)), {
                nullable: (_g = (_f = resolverInfo.agField) === null || _f === void 0 ? void 0 : _f.gqlOptions) === null || _g === void 0 ? void 0 : _g.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            if (!isArrayGraphType) {
                (0, common_1.UseInterceptors)(new crud_gen_gql_interceptor_js_1.CrudGenGqlInterceptor())(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            }
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, crud_gen_args_gql_decorator_js_1.CrudGenArgs)({
                fieldType: relType,
                entityType: relType,
                defaultValue: (_j = (_h = resolverInfo.agField) === null || _h === void 0 ? void 0 : _h.relation) === null || _j === void 0 ? void 0 : _j.defaultValue,
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
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    const parentRes = parent[resolverInfo.relation.propertyName];
                    if (parentRes !== undefined) {
                        if (hasFilters(findOptions))
                            throw new crud_gen_error_js_1.CrudGenError('Cannot specify join arguments and resolver arguments at the same time');
                        return parentRes;
                    }
                    const dataLoader = await this.moduleRef.resolve((0, dataloader_helper_js_1.getDataloaderToken)(relType), core_1.ContextIdFactory.getByRequest(graphql_1.GqlExecutionContext.create(context).getContext(), ['req']), { strict: false });
                    const joinCol = (_e = (_c = (_b = (_a = resolverInfo.agField) === null || _a === void 0 ? void 0 : _a.relation) === null || _b === void 0 ? void 0 : _b.targetKey.alias) !== null && _c !== void 0 ? _c : (_d = resolverInfo.join) === null || _d === void 0 ? void 0 : _d.referencedColumnName) !== null && _e !== void 0 ? _e : dataLoader.getSearchKey();
                    const parentCol = (_k = (_h = (_g = (_f = resolverInfo.agField) === null || _f === void 0 ? void 0 : _f.relation) === null || _g === void 0 ? void 0 : _g.sourceKey.alias) !== null && _h !== void 0 ? _h : (_j = resolverInfo.join) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : dataLoader.getSearchKey();
                    return dataLoader.loadOne([joinCol, parent[parentCol]], findOptions, false);
                },
            });
            const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, resolverInfo.relation.propertyName);
            if (!descriptor)
                throw new ReferenceError(`GenericResolver.${resolverInfo.relation.propertyName} must have a descriptor`);
            (0, graphql_1.ResolveField)((0, returnValue_js_1.default)(relType), {
                nullable: (_l = (_k = resolverInfo.agField) === null || _k === void 0 ? void 0 : _k.gqlOptions) === null || _l === void 0 ? void 0 : _l.nullable,
            })(resolver.prototype, resolverInfo.relation.propertyName, descriptor);
            (0, graphql_1.Parent)()(resolver.prototype, resolverInfo.relation.propertyName, 0);
            (0, crud_gen_args_gql_decorator_js_1.CrudGenArgsSingle)({ fieldType: relType, entityType: relType })(resolver.prototype, resolverInfo.relation.propertyName, 1);
            (0, nest_decorator_js_1.GetContext)()(resolver.prototype, resolverInfo.relation.propertyName, 2);
            Reflect.metadata('design:paramtypes', [Object, Array, Object])(resolver.prototype, resolverInfo.relation.propertyName);
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
            return dataLoader.loadOne([dataLoader.getSearchKey(), finalId], findOptions, (_a = methodOptions.throwOnNotFound) !== null && _a !== void 0 ? _a : false);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...generateDecorators(graphql_1.Query, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    const fieldType = (_c = (_b = methodOptions.returnType) === null || _b === void 0 ? void 0 : _b.call(methodOptions)) !== null && _c !== void 0 ? _c : returnType;
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
        (0, graphql_1.Args)((_d = methodOptions.idName) !== null && _d !== void 0 ? _d : 'ID', {
            nullable: false,
            type: (0, returnValue_js_1.default)(String),
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
            var _a;
            const service = this.service;
            const where = findOptions === null || findOptions === void 0 ? void 0 : findOptions.where;
            const hasStructuredFilters = !!where &&
                typeof where === 'object' &&
                ((typeof where.filters === 'object' &&
                    Object.keys((_a = where.filters) !== null && _a !== void 0 ? _a : {}).length > 0) ||
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_1.Query, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_js_1.default)((0, crud_gen_gql_type_js_1.default)(returnType)), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, common_1.UseInterceptors)(new crud_gen_gql_interceptor_js_1.CrudGenGqlInterceptor())(resolver.prototype, queryName, descriptor);
    const fieldType = (_c = (_b = methodOptions.returnType) === null || _b === void 0 ? void 0 : _b.call(methodOptions)) !== null && _c !== void 0 ? _c : returnType;
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
    var _a, _b, _c, _d, _e;
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_2.Mutation, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.create) !== null && _b !== void 0 ? _b : returnType; },
        },
        fieldType: (_c = (_b = options.input) === null || _b === void 0 ? void 0 : _b.create) !== null && _c !== void 0 ? _c : returnType,
        _name: 'input',
    })(resolver.prototype, queryName, 0);
    const fieldType = (_e = (_d = methodOptions.returnType) === null || _d === void 0 ? void 0 : _d.call(methodOptions)) !== null && _e !== void 0 ? _e : returnType;
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
    (0, common_1.applyDecorators)(...generateDecorators(graphql_2.Mutation, `${(_a = options.prefix) !== null && _a !== void 0 ? _a : ''}update${options.entityModel.name}`, (_b = methodOptions.returnType) !== null && _b !== void 0 ? _b : (0, returnValue_js_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        fieldType: (_d = (_c = options.input) === null || _c === void 0 ? void 0 : _c.conditions) !== null && _d !== void 0 ? _d : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    (0, gqlmapper_decorator_js_1.InputArgs)({
        fieldType: (_f = (_e = options.input) === null || _e === void 0 ? void 0 : _e.update) !== null && _f !== void 0 ? _f : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.update) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'input',
    })(resolver.prototype, queryName, 1);
    const fieldType = (_h = (_g = methodOptions.returnType) === null || _g === void 0 ? void 0 : _g.call(methodOptions)) !== null && _h !== void 0 ? _h : returnType;
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
    var _a, _b;
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
        fieldType: (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
function resolverFactory(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const returnType = (_a = options.dto) !== null && _a !== void 0 ? _a : options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.moduleRef;
        }
    };
    BaseClass = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType), { isAbstract: true }),
        __param(0, (0, common_1.Inject)((_c = (_b = options.service) === null || _b === void 0 ? void 0 : _b.serviceToken) !== null && _c !== void 0 ? _c : (0, generic_service_js_1.getServiceToken)(options.entityModel))),
        __param(1, (0, common_1.Inject)((_e = (_d = options.service) === null || _d === void 0 ? void 0 : _d.dataLoaderToken) !== null && _e !== void 0 ? _e : (0, dataloader_helper_js_1.getDataloaderToken)(options.entityModel))),
        __param(2, (0, common_1.Inject)((_f = options.moduleRefToken) !== null && _f !== void 0 ? _f : core_1.ModuleRef)),
        __metadata("design:paramtypes", [generic_service_js_1.GenericService,
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
                resolverInfoList[objIndex] = Object.assign(Object.assign({}, relInfo), { join: Object.assign(Object.assign({}, relInfo.join), { propertyName, name: field.relation.sourceKey.alias, target, referencedColumnName: target }), relation: Object.assign(Object.assign({}, relInfo.relation), { propertyName, relationType: field.relation.relationType, type: field.relation.type, target: options.entityModel }), agField: Object.assign(Object.assign({}, relInfo.agField), field) });
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
    const createOptions = (_h = (_g = options.mutations) === null || _g === void 0 ? void 0 : _g.createResource) !== null && _h !== void 0 ? _h : {};
    const updateOptions = (_k = (_j = options.mutations) === null || _j === void 0 ? void 0 : _j.updateResource) !== null && _k !== void 0 ? _k : {};
    const deleteOptions = (_m = (_l = options.mutations) === null || _l === void 0 ? void 0 : _l.deleteResource) !== null && _m !== void 0 ? _m : {};
    let Mutations = class Mutations extends BaseClass {
    };
    Mutations = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType), {
            isAbstract: true,
        })
    ], Mutations);
    defineCreateMutation(`${(_o = options.prefix) !== null && _o !== void 0 ? _o : ''}create${options.entityModel.name}`, returnType, Mutations, options, createOptions);
    defineUpdateMutation(`${(_p = options.prefix) !== null && _p !== void 0 ? _p : ''}update${options.entityModel.name}`, returnType, Mutations, options, updateOptions);
    defineDeleteMutation(`${(_q = options.prefix) !== null && _q !== void 0 ? _q : ''}delete${options.entityModel.name}`, returnType, Mutations, options, deleteOptions);
    const getResourceOptions = (_s = (_r = options.queries) === null || _r === void 0 ? void 0 : _r.getResource) !== null && _s !== void 0 ? _s : {};
    const getResourceGridOptions = (_u = (_t = options.queries) === null || _t === void 0 ? void 0 : _t.getResourceGrid) !== null && _u !== void 0 ? _u : {};
    let GenericResolver = class GenericResolver extends (options.readonly ? BaseClass : Mutations) {
    };
    GenericResolver = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_js_1.default)(returnType))
    ], GenericResolver);
    defineGetSingleResource(`${(_v = options.prefix) !== null && _v !== void 0 ? _v : ''}get${options.entityModel.name}`, returnType, GenericResolver, getResourceOptions);
    defineGetGridResource(`${(_w = options.prefix) !== null && _w !== void 0 ? _w : ''}get${options.entityModel.name}Grid`, returnType, GenericResolver, getResourceGridOptions);
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