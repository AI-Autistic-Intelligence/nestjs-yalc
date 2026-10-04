import { Scope } from '@nestjs/common';
import { InputType, Int, ObjectType } from '@nestjs/graphql';
import { getDataSourceToken } from '@nestjs/typeorm';
import { CrudGenResourceFactory, FilterOptionType, ModelField, ModelObject, getServiceToken, } from '@nest-yalc-2/crud-gen';
import { GQLDataLoader, getDataloaderToken, getFn, } from '@nest-yalc-2/data-loader';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { Exclude, Expose } from 'class-transformer';
import { GraphQLJSON } from 'graphql-type-json';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { getOmniRelationProjectionAliases, getOmniRelationProjectionAllowedKinds, } from './omni-relation-projection.definition.js';
import { OmniRelationProjectionService } from './omni-relation-projection.service.js';
import { createOmniRelationKindContract } from './omni-relation-kind.contract.js';
import { OMNI_KERNEL_OPTIONS, OmniScopeContext } from './omni-scope.js';
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
    ModelField({
        dst: destination,
        gqlType: returnValue(type),
        gqlOptions: { nullable },
    })(target.prototype, name);
    Expose()(target.prototype, name);
}
function defaultGraphqlNames(apiModel) {
    return {
        object: apiModel.name,
        create: `${apiModel.name}CreateInput`,
        patch: `${apiModel.name}UpdateInput`,
        conditions: `${apiModel.name}Condition`,
    };
}
export function createOmniRelationProjectionGraphqlTypes(definition, names) {
    const aliases = getOmniRelationProjectionAliases(definition);
    const multipleKinds = getOmniRelationProjectionAllowedKinds(definition).length > 1;
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
    ObjectType(names.object)(object);
    ModelObject({
        filters: { type: FilterOptionType.INCLUDE, fields: ['guid'] },
    })(object);
    Exclude()(object);
    addField(object, 'guid', 'guid', UUIDScalar, false);
    if (multipleKinds) {
        addField(object, aliases.kind, 'kind', String, false);
    }
    addField(object, aliases.source, 'sourceRecordId', UUIDScalar, false);
    addField(object, aliases.target, 'targetRecordId', UUIDScalar, false);
    addField(object, 'revision', 'revision', Int, false);
    addField(object, aliases.payload, 'payload', GraphQLJSON, true);
    const create = namedClass(names.create);
    InputType(names.create)(create);
    ModelObject()(create);
    addField(create, 'guid', 'guid', UUIDScalar, false);
    if (multipleKinds) {
        addField(create, aliases.kind, 'kind', String, false);
    }
    addField(create, aliases.source, 'sourceRecordId', UUIDScalar, false);
    addField(create, aliases.target, 'targetRecordId', UUIDScalar, false);
    addField(create, aliases.payload, 'payload', GraphQLJSON, true);
    const patch = namedClass(names.patch);
    InputType(names.patch)(patch);
    ModelObject()(patch);
    addField(patch, aliases.payload, 'payload', GraphQLJSON, true);
    addField(patch, 'expectedRevision', 'expectedRevision', Int, false);
    const conditions = namedClass(names.conditions);
    InputType(names.conditions)(conditions);
    ModelObject()(conditions);
    addField(conditions, 'guid', 'guid', UUIDScalar, false);
    return { object, create, patch, conditions };
}
export function createOmniRelationProjectionRegistration(options) {
    const graphqlTypes = createOmniRelationProjectionGraphqlTypes(options.definition, options.graphql?.names ?? defaultGraphqlNames(options.apiModel));
    const serviceToken = getServiceToken(options.apiModel);
    const dataLoaderToken = getDataloaderToken(options.apiModel);
    const resource = CrudGenResourceFactory({
        entityModel: options.apiModel,
        backend: false,
        graphql: {
            resolver: {
                dto: graphqlTypes.object,
                input: {
                    create: graphqlTypes.create,
                    update: graphqlTypes.patch,
                    conditions: graphqlTypes.conditions,
                },
                ...(options.graphql?.prefix ? { prefix: options.graphql.prefix } : {}),
                ...(options.moduleRefToken !== undefined
                    ? { moduleRefToken: options.moduleRefToken }
                    : {}),
                queries: { getResource: { idName: 'guid' } },
            },
            serviceToken,
            dataLoaderToken,
        },
        rest: {
            dto: graphqlTypes.object,
            serialize: true,
            ...(options.rest?.path ? { path: options.rest.path } : {}),
            idField: 'guid',
            serviceToken,
        },
    });
    const relationKinds = Object.freeze([
        ...getOmniRelationProjectionAllowedKinds(options.definition),
    ]);
    const reader = Object.freeze({
        type: 'relation',
        id: options.definition.id,
        definition: options.definition,
    });
    const serviceProvider = options.lifecycle && options.catalog
        ? {
            provide: serviceToken,
            scope: Scope.REQUEST,
            useFactory: (dataSource, scope, omniOptions, lifecycle, catalog) => new OmniRelationProjectionService(dataSource.getRepository(OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(OmniRecordEntity), createOmniRelationKindContract(relationKinds), options.definition, dataSource, lifecycle, catalog),
            inject: [
                getDataSourceToken(options.dbConnection),
                OmniScopeContext,
                OMNI_KERNEL_OPTIONS,
                options.lifecycle.token,
                options.catalog.token,
            ],
        }
        : options.lifecycle
            ? {
                provide: serviceToken,
                scope: Scope.REQUEST,
                useFactory: (dataSource, scope, omniOptions, lifecycle) => new OmniRelationProjectionService(dataSource.getRepository(OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(OmniRecordEntity), createOmniRelationKindContract(relationKinds), options.definition, dataSource, lifecycle),
                inject: [
                    getDataSourceToken(options.dbConnection),
                    OmniScopeContext,
                    OMNI_KERNEL_OPTIONS,
                    options.lifecycle.token,
                ],
            }
            : {
                provide: serviceToken,
                scope: Scope.REQUEST,
                useFactory: (dataSource, scope, omniOptions) => new OmniRelationProjectionService(dataSource.getRepository(OmniRelationEntity), scope, omniOptions.deletion.relation, dataSource.getRepository(OmniRecordEntity), createOmniRelationKindContract(relationKinds), options.definition, dataSource, undefined),
                inject: [
                    getDataSourceToken(options.dbConnection),
                    OmniScopeContext,
                    OMNI_KERNEL_OPTIONS,
                ],
            };
    const providers = [
        serviceProvider,
        {
            provide: dataLoaderToken,
            scope: Scope.REQUEST,
            useFactory: (service, scope) => new GQLDataLoader(getFn(service), 'guid', undefined, {
                cacheKeyFn: (key) => scope.cacheKey(key),
            }),
            inject: [serviceToken, OmniScopeContext],
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