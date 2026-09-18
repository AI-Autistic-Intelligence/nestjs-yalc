import { type InjectionToken, type Provider } from '@nestjs/common';
import { type ICrudGenResourceFactoryResult } from '@nest-yalc-2/crud-gen';
import type { ClassType } from '@nest-yalc-2/types/globals.d.js';
import type { ObjectLiteral } from 'typeorm';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import type { OmniProjectionReaderCatalogProvider, OmniRelationProjectionReaderRegistration } from './omni-projection.catalog.js';
import { type OmniRelationProjectionDefinition } from './omni-relation-projection.definition.js';
import type { OmniProjectionLifecycleProvider } from './omni-projection.lifecycle.js';
type RelationGraphqlClass = new () => Record<string, unknown>;
export interface OmniRelationProjectionGraphqlNames {
    object: string;
    create: string;
    patch: string;
    conditions: string;
}
export interface OmniRelationProjectionRegistrationOptions<Api extends ObjectLiteral> {
    apiModel: ClassType<Api>;
    definition: OmniRelationProjectionDefinition;
    dbConnection: string;
    catalog?: OmniProjectionReaderCatalogProvider;
    lifecycle?: OmniProjectionLifecycleProvider<OmniRelationProjectionDefinition, OmniRelationEntity>;
    rest?: {
        path?: string;
    };
    graphql?: {
        prefix?: string;
        names?: OmniRelationProjectionGraphqlNames;
    };
    moduleRefToken?: InjectionToken;
}
export interface OmniRelationProjectionGraphqlTypes {
    object: RelationGraphqlClass;
    create: RelationGraphqlClass;
    patch: RelationGraphqlClass;
    conditions: RelationGraphqlClass;
}
export interface OmniRelationProjectionRegistration<Api extends ObjectLiteral> {
    entities: readonly [];
    relationKinds: readonly string[];
    definition: OmniRelationProjectionDefinition;
    reader: OmniRelationProjectionReaderRegistration;
    graphqlTypes: OmniRelationProjectionGraphqlTypes;
    resource: ICrudGenResourceFactoryResult<Api>;
    controllers: readonly ClassType[];
    providers: readonly Provider[];
    serviceToken: string;
    dataLoaderToken: string;
}
export declare function createOmniRelationProjectionGraphqlTypes(definition: OmniRelationProjectionDefinition, names: OmniRelationProjectionGraphqlNames): OmniRelationProjectionGraphqlTypes;
export declare function createOmniRelationProjectionRegistration<Api extends ObjectLiteral>(options: OmniRelationProjectionRegistrationOptions<Api>): OmniRelationProjectionRegistration<Api>;
export {};
