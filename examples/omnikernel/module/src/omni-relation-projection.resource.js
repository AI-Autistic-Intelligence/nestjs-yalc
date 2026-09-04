"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOmniRelationProjectionGraphqlTypes = createOmniRelationProjectionGraphqlTypes;
exports.createOmniRelationProjectionRegistration = createOmniRelationProjectionRegistration;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const data_loader_1 = require("@nestjs-yalc/data-loader");
const uuid_scalar_js_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const class_transformer_1 = require("class-transformer");
const graphql_type_json_1 = require("graphql-type-json");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_relation_projection_definition_js_1 = require("./omni-relation-projection.definition.js");
const omni_relation_projection_service_js_1 = require("./omni-relation-projection.service.js");
const omni_relation_kind_contract_js_1 = require("./omni-relation-kind.contract.js");
const omni_scope_js_1 = require("./omni-scope.js");
function namedClass(name, outputFields) {
    return {
        [name]: class {
            constructor(data) {
                if (!outputFields) {
                    Object.assign(this, data);
                    return;
                }
                for (const [publicName, destination] of outputFields) {
                    if (data && Object.prototype.hasOwnProperty.call(data, destination)) {
                        this[publicName] = data[destination];
                    }
                }
            }
        },
    }[name];
}
function addField(target, name, destination, type, nullable) {
    (0, crud_gen_1.ModelField)({
        dst: destination,
        gqlType: (0, returnValue_js_1.default)(type),
        gqlOptions: { nullable },
    })(target.prototype, name);
    (0, class_transformer_1.Expose)()(target.prototype, name);
}
function defaultGraphqlNames(apiModel) {
    return {
        object: apiModel.name,
        create: `${apiModel.name}CreateInput`,
        patch: `${apiModel.name}UpdateInput`,
        conditions: `${apiModel.name}Condition`,
    };
}
function createOmniRelationProjectionGraphqlTypes(definition, names) {
    const aliases = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAliases)(definition);
    const multipleKinds = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(definition).length > 1;
    const objectFields = [
        ['guid', 'guid'],
        [aliases.source, 'sourceRecordId'],
        [aliases.target, 'targetRecordId'],
        ['revision', 'revision'],
        [aliases.payload, 'payload'],
    ];
    if (multipleKinds)
        objectFields.splice(1, 0, [aliases.kind, 'kind']);
    const object = namedClass(names.object, objectFields);
    (0, graphql_1.ObjectType)(names.object)(object);
    (0, crud_gen_1.ModelObject)({
        filters: { type: crud_gen_1.FilterOptionType.INCLUDE, fields: ['guid'] },
    })(object);
    (0, class_transformer_1.Exclude)()(object);
    addField(object, 'guid', 'guid', uuid_scalar_js_1.UUIDScalar, false);
    if (multipleKinds) {
        addField(object, aliases.kind, 'kind', String, false);
    }
    addField(object, aliases.source, 'sourceRecordId', uuid_scalar_js_1.UUIDScalar, false);
    addField(object, aliases.target, 'targetRecordId', uuid_scalar_js_1.UUIDScalar, false);
    addField(object, 'revision', 'revision', graphql_1.Int, false);
    addField(object, aliases.payload, 'payload', graphql_type_json_1.GraphQLJSON, true);
    const create = namedClass(names.create);
    (0, graphql_1.InputType)(names.create)(create);
    (0, crud_gen_1.ModelObject)()(create);
    addField(create, 'guid', 'guid', uuid_scalar_js_1.UUIDScalar, false);
    if (multipleKinds) {
        addField(create, aliases.kind, 'kind', String, false);
    }
    addField(create, aliases.source, 'sourceRecordId', uuid_scalar_js_1.UUIDScalar, false);
    addField(create, aliases.target, 'targetRecordId', uuid_scalar_js_1.UUIDScalar, false);
    addField(create, aliases.payload, 'payload', graphql_type_json_1.GraphQLJSON, true);
    const patch = namedClass(names.patch);
    (0, graphql_1.InputType)(names.patch)(patch);
    (0, crud_gen_1.ModelObject)()(patch);
    addField(patch, aliases.payload, 'payload', graphql_type_json_1.GraphQLJSON, true);
    addField(patch, 'expectedRevision', 'expectedRevision', graphql_1.Int, false);
    const conditions = namedClass(names.conditions);
    (0, graphql_1.InputType)(names.conditions)(conditions);
    (0, crud_gen_1.ModelObject)()(conditions);
    addField(conditions, 'guid', 'guid', uuid_scalar_js_1.UUIDScalar, false);
    return { object, create, patch, conditions };
}
function createOmniRelationProjectionRegistration(options) {
    var _a, _b, _c, _d;
    const graphqlTypes = createOmniRelationProjectionGraphqlTypes(options.definition, (_b = (_a = options.graphql) === null || _a === void 0 ? void 0 : _a.names) !== null && _b !== void 0 ? _b : defaultGraphqlNames(options.apiModel));
    const serviceToken = (0, crud_gen_1.getServiceToken)(options.apiModel);
    const dataLoaderToken = (0, data_loader_1.getDataloaderToken)(options.apiModel);
    const resource = (0, crud_gen_1.CrudGenResourceFactory)({
        entityModel: options.apiModel,
        backend: false,
        graphql: {
            resolver: Object.assign(Object.assign(Object.assign({ dto: graphqlTypes.object, input: {
                    create: graphqlTypes.create,
                    update: graphqlTypes.patch,
                    conditions: graphqlTypes.conditions,
                } }, (((_c = options.graphql) === null || _c === void 0 ? void 0 : _c.prefix) ? { prefix: options.graphql.prefix } : {})), (options.moduleRefToken !== undefined
                ? { moduleRefToken: options.moduleRefToken }
                : {})), { queries: { getResource: { idName: 'guid' } } }),
            serviceToken,
            dataLoaderToken,
        },
        rest: Object.assign(Object.assign({ dto: graphqlTypes.object, serialize: true }, (((_d = options.rest) === null || _d === void 0 ? void 0 : _d.path) ? { path: options.rest.path } : {})), { idField: 'guid', serviceToken }),
    });
    const relationKinds = Object.freeze([
        ...(0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(options.definition),
    ]);
    const reader = Object.freeze({
        type: 'relation',
        id: options.definition.id,
        definition: options.definition,
    });
    const serviceProvider = options.lifecycle && options.catalog
        ? {
            provide: serviceToken,
            scope: common_1.Scope.REQUEST,
            useFactory: (dataSource, scope, omniOptions, lifecycle, catalog) => new omni_relation_projection_service_js_1.OmniRelationProjectionService(dataSource.getRepository(omni_relation_entity_js_1.OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), (0, omni_relation_kind_contract_js_1.createOmniRelationKindContract)(relationKinds), options.definition, dataSource, lifecycle, catalog),
            inject: [
                (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                omni_scope_js_1.OmniScopeContext,
                omni_scope_js_1.OMNI_KERNEL_OPTIONS,
                options.lifecycle.token,
                options.catalog.token,
            ],
        }
        : options.lifecycle
            ? {
                provide: serviceToken,
                scope: common_1.Scope.REQUEST,
                useFactory: (dataSource, scope, omniOptions, lifecycle) => new omni_relation_projection_service_js_1.OmniRelationProjectionService(dataSource.getRepository(omni_relation_entity_js_1.OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), (0, omni_relation_kind_contract_js_1.createOmniRelationKindContract)(relationKinds), options.definition, dataSource, lifecycle),
                inject: [
                    (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                    omni_scope_js_1.OmniScopeContext,
                    omni_scope_js_1.OMNI_KERNEL_OPTIONS,
                    options.lifecycle.token,
                ],
            }
            : {
                provide: serviceToken,
                scope: common_1.Scope.REQUEST,
                useFactory: (dataSource, scope, omniOptions) => new omni_relation_projection_service_js_1.OmniRelationProjectionService(dataSource.getRepository(omni_relation_entity_js_1.OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), (0, omni_relation_kind_contract_js_1.createOmniRelationKindContract)(relationKinds), options.definition, dataSource, undefined),
                inject: [
                    (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                    omni_scope_js_1.OmniScopeContext,
                    omni_scope_js_1.OMNI_KERNEL_OPTIONS,
                ],
            };
    const providers = [
        serviceProvider,
        {
            provide: dataLoaderToken,
            scope: common_1.Scope.REQUEST,
            useFactory: (service, scope) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', undefined, {
                cacheKeyFn: (key) => scope.cacheKey(key),
            }),
            inject: [serviceToken, omni_scope_js_1.OmniScopeContext],
        },
        ...resource.providers,
    ];
    return Object.freeze({
        entities: Object.freeze([]),
        relationKinds,
        definition: options.definition,
        reader,
        graphqlTypes: Object.freeze(graphqlTypes),
        resource,
        controllers: Object.freeze([...resource.controllers]),
        providers: Object.freeze(providers),
        serviceToken,
        dataLoaderToken,
    });
}
//# sourceMappingURL=omni-relation-projection.resource.js.map