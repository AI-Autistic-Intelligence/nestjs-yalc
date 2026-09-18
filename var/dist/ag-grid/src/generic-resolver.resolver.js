"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolverFactory = resolverFactory;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./generic-mutation.resolver"), exports);
tslib_1.__exportStar(require("./generic-query.resolver"), exports);
tslib_1.__exportStar(require("./generic-resolver.type"), exports);
const graphql_1 = require("@nestjs/graphql");
const generic_service_service_1 = require("@nest-yalc-2/ag-grid/generic-service.service");
const dataloader_helper_1 = require("@nest-yalc-2/data-loader/dataloader.helper");
const returnValue_1 = tslib_1.__importDefault(require("@node-yalc/utils/returnValue"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
const generic_mutation_resolver_1 = require("./generic-mutation.resolver");
const generic_query_resolver_1 = require("./generic-query.resolver");
const generic_resolver_type_1 = require("./generic-resolver.type");
const object_decorator_1 = require("./object.decorator");
function resolverFactory(options) {
    const returnType = options.dto ?? options.entityModel;
    let BaseClass = class BaseClass {
        constructor(service, dataLoader, moduleRef) {
            this.service = service;
            this.dataLoader = dataLoader;
            this.moduleRef = moduleRef;
            this.contextId = core_1.ContextIdFactory.create();
            this.moduleRef;
        }
    };
    BaseClass = tslib_1.__decorate([
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType), { isAbstract: true }),
        tslib_1.__param(0, (0, common_1.Inject)(options.service?.serviceToken ?? (0, generic_service_service_1.getServiceToken)(options.entityModel))),
        tslib_1.__param(1, (0, common_1.Inject)(options.service?.dataLoaderToken ??
            (0, dataloader_helper_1.getDataloaderToken)(options.entityModel))),
        tslib_1.__metadata("design:paramtypes", [generic_service_service_1.GenericService,
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
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType), {
            isAbstract: true,
        })
    ], Mutations);
    (0, generic_mutation_resolver_1.defineCreateMutation)(`${options.prefix ?? ''}create${options.entityModel.name}`, returnType, Mutations, options, createOptions);
    (0, generic_mutation_resolver_1.defineUpdateMutation)(`${options.prefix ?? ''}update${options.entityModel.name}`, returnType, Mutations, options, updateOptions);
    (0, generic_mutation_resolver_1.defineDeleteMutation)(`${options.prefix ?? ''}delete${options.entityModel.name}`, returnType, Mutations, options, deleteOptions);
    const getResourceOptions = options.queries?.getResource ?? {};
    const getResourceGridOptions = options.queries?.getResourceGrid ?? {};
    let GenericResolver = class GenericResolver extends (options.readonly ? BaseClass : Mutations) {
    };
    GenericResolver = tslib_1.__decorate([
        (0, graphql_1.Resolver)((0, returnValue_1.default)(returnType))
    ], GenericResolver);
    (0, generic_query_resolver_1.defineGetSingleResource)(`${options.prefix ?? ''}get${options.entityModel.name}`, returnType, GenericResolver, getResourceOptions);
    (0, generic_query_resolver_1.defineGetGridResource)(`${options.prefix ?? ''}get${options.entityModel.name}Grid`, returnType, GenericResolver, getResourceGridOptions);
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