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
var ProjectionSpikeAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionSpikeAppModule = exports.PROJECTION_SPIKE_DIALECT = void 0;
const common_1 = require("@nestjs/common");
const apollo_1 = require("@nestjs/apollo");
const event_emitter_1 = require("@nestjs/event-emitter");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const event_manager_1 = require("@nest-yalc-2/event-manager");
const uuid_scalar_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar");
const projection_spike_definition_1 = require("./projection-spike.definition");
const projection_spike_entities_1 = require("./projection-spike.entities");
const projection_spike_services_1 = require("./projection-spike.services");
exports.PROJECTION_SPIKE_DIALECT = Symbol('PROJECTION_SPIKE_DIALECT');
let ProjectionSpikeAuthenticationMiddleware = class ProjectionSpikeAuthenticationMiddleware {
    use(request, _response, next) {
        var _a;
        const match = /^Bearer projection-spike:(scope-(?:alpha|bravo))$/.exec((_a = request.headers.authorization) !== null && _a !== void 0 ? _a : '');
        if (match)
            request.projectionScopeId = match[1];
        next();
    }
};
ProjectionSpikeAuthenticationMiddleware = __decorate([
    (0, common_1.Injectable)()
], ProjectionSpikeAuthenticationMiddleware);
let ProjectionRelationType = class ProjectionRelationType {
    constructor(data) {
        Object.assign(this, data);
    }
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, crud_gen_1.ModelField)({}),
    __metadata("design:type", String)
], ProjectionRelationType.prototype, "guid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, crud_gen_1.ModelField)({}),
    __metadata("design:type", String)
], ProjectionRelationType.prototype, "sourceGuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, crud_gen_1.ModelField)({}),
    __metadata("design:type", String)
], ProjectionRelationType.prototype, "targetGuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, crud_gen_1.ModelField)({}),
    __metadata("design:type", String)
], ProjectionRelationType.prototype, "kind", void 0);
ProjectionRelationType = __decorate([
    (0, graphql_1.ObjectType)('ProjectionRelation'),
    (0, crud_gen_1.ModelObject)(),
    __metadata("design:paramtypes", [Object])
], ProjectionRelationType);
let ProjectionRelationCreateInput = class ProjectionRelationCreateInput {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationCreateInput.prototype, "guid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationCreateInput.prototype, "sourceGuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationCreateInput.prototype, "targetGuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationCreateInput.prototype, "kind", void 0);
ProjectionRelationCreateInput = __decorate([
    (0, graphql_1.InputType)('ProjectionRelationCreateInput'),
    (0, crud_gen_1.ModelObject)()
], ProjectionRelationCreateInput);
let ProjectionRelationPatchInput = class ProjectionRelationPatchInput {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationPatchInput.prototype, "kind", void 0);
ProjectionRelationPatchInput = __decorate([
    (0, graphql_1.InputType)('ProjectionRelationPatchInput'),
    (0, crud_gen_1.ModelObject)()
], ProjectionRelationPatchInput);
let ProjectionRelationCondition = class ProjectionRelationCondition {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProjectionRelationCondition.prototype, "guid", void 0);
ProjectionRelationCondition = __decorate([
    (0, graphql_1.InputType)('ProjectionRelationCondition'),
    (0, crud_gen_1.ModelObject)()
], ProjectionRelationCondition);
const projectionRecordTypes = (0, crud_gen_1.createProjectionGraphqlTypes)(projection_spike_definition_1.projectionRecordDefinition, {
    object: 'ProjectionRecord',
    create: 'ProjectionRecordCreateInput',
    patch: 'ProjectionRecordPatchInput',
    conditions: 'ProjectionRecordCondition',
});
const projectionRecordResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: projection_spike_entities_1.ProjectionRecord,
    backend: false,
    graphql: {
        resolver: {
            dto: projectionRecordTypes.object,
            input: {
                create: projectionRecordTypes.create,
                update: projectionRecordTypes.patch,
                conditions: projectionRecordTypes.conditions,
            },
            queries: {
                getResource: {
                    idName: 'guid',
                    queryParams: { name: 'getProjectionRecord' },
                },
                getResourceGrid: { queryParams: { name: 'getProjectionRecordGrid' } },
            },
            mutations: {
                createResource: { queryParams: { name: 'createProjectionRecord' } },
                updateResource: { queryParams: { name: 'updateProjectionRecord' } },
                deleteResource: { queryParams: { name: 'deleteProjectionRecord' } },
            },
        },
        serviceToken: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRecord),
        dataLoaderToken: (0, data_loader_1.getDataloaderToken)(projection_spike_entities_1.ProjectionRecord),
    },
    rest: {
        dto: projectionRecordTypes.object,
        serialize: true,
        path: 'projection-records',
        idField: 'guid',
        serviceToken: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRecord),
    },
});
const projectionRelationResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: projection_spike_entities_1.ProjectionRelation,
    backend: false,
    graphql: {
        resolver: {
            dto: ProjectionRelationType,
            input: {
                create: ProjectionRelationCreateInput,
                update: ProjectionRelationPatchInput,
                conditions: ProjectionRelationCondition,
            },
            queries: {
                getResource: {
                    idName: 'guid',
                    queryParams: { name: 'getProjectionRelation' },
                },
                getResourceGrid: { queryParams: { name: 'getProjectionRelationGrid' } },
            },
            mutations: {
                createResource: { queryParams: { name: 'createProjectionRelation' } },
                updateResource: { queryParams: { name: 'updateProjectionRelation' } },
                deleteResource: { queryParams: { name: 'deleteProjectionRelation' } },
            },
        },
        serviceToken: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRelation),
        dataLoaderToken: (0, data_loader_1.getDataloaderToken)(projection_spike_entities_1.ProjectionRelation),
    },
    rest: {
        dto: ProjectionRelationType,
        serialize: true,
        path: 'projection-relations',
        idField: 'guid',
        serviceToken: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRelation),
    },
});
let ProjectionSpikeAppModule = ProjectionSpikeAppModule_1 = class ProjectionSpikeAppModule {
    static register(options) {
        const dialect = (0, projection_spike_entities_1.createProjectionSpikeDialect)(options.dialect);
        const recordSchema = (0, projection_spike_entities_1.createProjectionRecordSchema)(dialect);
        const relationSchema = (0, projection_spike_entities_1.createProjectionRelationSchema)();
        const dataSourceOptions = options.dialect === 'postgres'
            ? {
                type: 'postgres',
                url: options.postgresUrl,
            }
            : {
                type: 'sqlite',
                database: ':memory:',
            };
        return {
            module: ProjectionSpikeAppModule_1,
            imports: [
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: true,
                    path: '/graphql',
                    context: ({ req }) => {
                        var _a;
                        const match = /^Bearer projection-spike:(scope-(?:alpha|bravo))$/.exec((_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '');
                        if (match)
                            req.projectionScopeId = match[1];
                        return { req };
                    },
                }),
                event_emitter_1.EventEmitterModule.forRoot(),
                event_manager_1.EventModule.forRootAsync(),
                typeorm_1.TypeOrmModule.forRoot(Object.assign(Object.assign({}, dataSourceOptions), { dropSchema: true, synchronize: true, autoLoadEntities: true })),
                typeorm_1.TypeOrmModule.forFeature([recordSchema, relationSchema]),
            ],
            controllers: [
                ...projectionRecordResource.controllers,
                ...projectionRelationResource.controllers,
            ],
            providers: [
                uuid_scalar_1.UUIDScalar,
                ProjectionSpikeAuthenticationMiddleware,
                projection_spike_services_1.ProjectionScopeContext,
                { provide: exports.PROJECTION_SPIKE_DIALECT, useValue: dialect },
                {
                    provide: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRecord),
                    scope: common_1.Scope.REQUEST,
                    useFactory: (dataSource, scope, projectionDialect, events) => new crud_gen_1.ProjectionResourceService(dataSource.getRepository(projection_spike_entities_1.ProjectionRecord), scope, projectionDialect, events, projection_spike_definition_1.projectionRecordDefinition),
                    inject: [
                        (0, typeorm_1.getDataSourceToken)(),
                        projection_spike_services_1.ProjectionScopeContext,
                        exports.PROJECTION_SPIKE_DIALECT,
                        event_manager_1.YalcEventService,
                    ],
                },
                {
                    provide: (0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRelation),
                    scope: common_1.Scope.REQUEST,
                    useFactory: (dataSource, scope, events) => new projection_spike_services_1.ProjectionSpikeRelationService(dataSource.getRepository(projection_spike_entities_1.ProjectionRelation), dataSource.getRepository(projection_spike_entities_1.ProjectionRecord), scope, events, projection_spike_definition_1.projectionRelationDefinition),
                    inject: [
                        (0, typeorm_1.getDataSourceToken)(),
                        projection_spike_services_1.ProjectionScopeContext,
                        event_manager_1.YalcEventService,
                    ],
                },
                {
                    provide: (0, data_loader_1.getDataloaderToken)(projection_spike_entities_1.ProjectionRecord),
                    scope: common_1.Scope.REQUEST,
                    useFactory: (service, scope) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', undefined, {
                        cacheKeyFn: (key) => scope.cacheKey(key),
                    }),
                    inject: [(0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRecord), projection_spike_services_1.ProjectionScopeContext],
                },
                {
                    provide: (0, data_loader_1.getDataloaderToken)(projection_spike_entities_1.ProjectionRelation),
                    scope: common_1.Scope.REQUEST,
                    useFactory: (service, scope) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', undefined, {
                        cacheKeyFn: (key) => scope.cacheKey(key),
                    }),
                    inject: [(0, crud_gen_1.getServiceToken)(projection_spike_entities_1.ProjectionRelation), projection_spike_services_1.ProjectionScopeContext],
                },
                ...projectionRecordResource.providers,
                ...projectionRelationResource.providers,
            ],
        };
    }
    configure(consumer) {
        consumer.apply(ProjectionSpikeAuthenticationMiddleware).forRoutes('*');
    }
};
exports.ProjectionSpikeAppModule = ProjectionSpikeAppModule;
exports.ProjectionSpikeAppModule = ProjectionSpikeAppModule = ProjectionSpikeAppModule_1 = __decorate([
    (0, common_1.Module)({})
], ProjectionSpikeAppModule);
//# sourceMappingURL=projection-spike.module.js.map