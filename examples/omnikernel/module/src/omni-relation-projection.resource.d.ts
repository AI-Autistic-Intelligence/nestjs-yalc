import { type InjectionToken, type Provider } from '@nestjs/common';
import { type ICrudGenResourceFactoryResult } from '@nest-yalc-2/crud-gen';
import type { ClassType } from '@node-yalc/types/globals.js';
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
    /** API-only model used by CrudGen to derive operation names and tokens. */
    apiModel: ClassType<Api>;
    definition: OmniRelationProjectionDefinition;
    dbConnection: string;
    /** Shared catalog provider, normally built from all returned registrations. */
    catalog?: OmniProjectionReaderCatalogProvider;
    /** Request-scoped app policy injected into the generated service factory. */
    lifecycle?: OmniProjectionLifecycleProvider<OmniRelationProjectionDefinition, OmniRelationEntity>;
    rest?: {
        path?: string;
    };
    graphql?: {
        prefix?: string;
        names?: OmniRelationProjectionGraphqlNames;
    };
    /** Optional consumer-owned ModuleRef token for generated GraphQL DI. */
    moduleRefToken?: InjectionToken;
}
export interface OmniRelationProjectionGraphqlTypes {
    object: RelationGraphqlClass;
    create: RelationGraphqlClass;
    patch: RelationGraphqlClass;
    conditions: RelationGraphqlClass;
}
export interface OmniRelationProjectionRegistration<Api extends ObjectLiteral> {
    /** omni-relation already belongs to OmniKernelModule; no new table exists. */
    entities: readonly [];
    /** Include these in OmniKernelModule.register({ relationKinds }). */
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
/** Builds aliased public types while retaining native fields inside the store. */
export declare function createOmniRelationProjectionGraphqlTypes(definition: OmniRelationProjectionDefinition, names: OmniRelationProjectionGraphqlNames): OmniRelationProjectionGraphqlTypes;
/**
 * Composes one generated REST/GraphQL/dataloader surface over omni-relation.
 * It never creates a relation table or a handwritten transport adapter.
 */
export declare function createOmniRelationProjectionRegistration<Api extends ObjectLiteral>(options: OmniRelationProjectionRegistrationOptions<Api>): OmniRelationProjectionRegistration<Api>;
export {};
