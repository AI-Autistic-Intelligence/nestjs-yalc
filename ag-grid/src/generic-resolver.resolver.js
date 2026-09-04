"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.resolverFactory = resolverFactory;
__exportStar(require("./generic-mutation.resolver"), exports);
__exportStar(require("./generic-query.resolver"), exports);
__exportStar(require("./generic-resolver.type"), exports);
const graphql_1 = require("@nestjs/graphql");
const generic_service_service_1 = require("@nestjs-yalc/ag-grid/generic-service.service");
const dataloader_helper_1 = require("@nestjs-yalc/data-loader/dataloader.helper");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
const generic_mutation_resolver_1 = require("./generic-mutation.resolver");
const generic_query_resolver_1 = require("./generic-query.resolver");
const generic_resolver_type_1 = require("./generic-resolver.type");
const object_decorator_1 = require("./object.decorator");
function resolverFactory(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const returnType = (_a = options.dto) !== null && _a !== void 0 ? _a : options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.contextId = core_1.ContextIdFactory.create();
            this.moduleRef;
        }
    };
    BaseClass = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType), { isAbstract: true }),
        __param(0, (0, common_1.Inject)((_c = (_b = options.service) === null || _b === void 0 ? void 0 : _b.serviceToken) !== null && _c !== void 0 ? _c : (0, generic_service_service_1.getServiceToken)(options.entityModel))),
        __param(1, (0, common_1.Inject)((_e = (_d = options.service) === null || _d === void 0 ? void 0 : _d.dataLoaderToken) !== null && _e !== void 0 ? _e : (0, dataloader_helper_1.getDataloaderToken)(options.entityModel))),
        __metadata("design:paramtypes", [generic_service_service_1.GenericService,
            dataloader_helper_1.GQLDataLoader,
            core_1.ModuleRef])
    ], BaseClass);
    const resolverInfoList = (0, ag_grid_metadata_helper_1.getEntityRelations)(options.entityModel, options.dto);
    const fieldMetadataList = (0, object_decorator_1.getAgGridFieldMetadataList)(returnType);
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
    const createOptions = (_g = (_f = options.mutations) === null || _f === void 0 ? void 0 : _f.createResource) !== null && _g !== void 0 ? _g : {};
    const updateOptions = (_j = (_h = options.mutations) === null || _h === void 0 ? void 0 : _h.updateResource) !== null && _j !== void 0 ? _j : {};
    const deleteOptions = (_l = (_k = options.mutations) === null || _k === void 0 ? void 0 : _k.deleteResource) !== null && _l !== void 0 ? _l : {};
    let Mutations = class Mutations extends BaseClass {
    };
    Mutations = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType), {
            isAbstract: true,
        })
    ], Mutations);
    (0, generic_mutation_resolver_1.defineCreateMutation)(`${(_m = options.prefix) !== null && _m !== void 0 ? _m : ''}create${options.entityModel.name}`, returnType, Mutations, options, createOptions);
    (0, generic_mutation_resolver_1.defineUpdateMutation)(`${(_o = options.prefix) !== null && _o !== void 0 ? _o : ''}update${options.entityModel.name}`, returnType, Mutations, options, updateOptions);
    (0, generic_mutation_resolver_1.defineDeleteMutation)(`${(_p = options.prefix) !== null && _p !== void 0 ? _p : ''}delete${options.entityModel.name}`, returnType, Mutations, options, deleteOptions);
    const getResourceOptions = (_r = (_q = options.queries) === null || _q === void 0 ? void 0 : _q.getResource) !== null && _r !== void 0 ? _r : {};
    const getResourceGridOptions = (_t = (_s = options.queries) === null || _s === void 0 ? void 0 : _s.getResourceGrid) !== null && _t !== void 0 ? _t : {};
    let GenericResolver = class GenericResolver extends (options.readonly ? BaseClass : Mutations) {
    };
    GenericResolver = __decorate([
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType))
    ], GenericResolver);
    (0, generic_query_resolver_1.defineGetSingleResource)(`${(_u = options.prefix) !== null && _u !== void 0 ? _u : ''}get${options.entityModel.name}`, returnType, GenericResolver, getResourceOptions);
    (0, generic_query_resolver_1.defineGetGridResource)(`${(_v = options.prefix) !== null && _v !== void 0 ? _v : ''}get${options.entityModel.name}Grid`, returnType, GenericResolver, getResourceGridOptions);
    (0, generic_query_resolver_1.defineFieldResolver)(resolverInfoList, GenericResolver);
    if (options.customQueries) {
        for (const methodName of Object.keys(options.customQueries)) {
            const queryName = methodName;
            const queryOptions = options.customQueries[methodName];
            if ((0, generic_resolver_type_1.isCustomSingleQueryOptions)(queryOptions)) {
                (0, generic_query_resolver_1.defineGetSingleResource)(queryName, returnType, GenericResolver, queryOptions);
            }
            else {
                (0, generic_query_resolver_1.defineGetGridResource)(queryName, returnType, GenericResolver, queryOptions);
            }
        }
    }
    return GenericResolver;
}
//# sourceMappingURL=generic-resolver.resolver.js.map