import { type InjectionToken, type Provider } from '@nestjs/common';
import { type ICrudGenResourceFactoryResult, type ProjectionGraphqlTypes } from '@nest-yalc-2/crud-gen';
import type { ClassType } from '@node-yalc/types/globals.js';
import type { EntityTarget, ObjectLiteral } from 'typeorm';
import type { OmniExtensionProjectionDefinition } from './omni-extension-projection.definition.js';
import type { OmniExtensionProjectionReaderRegistration, OmniProjectionReaderCatalogProvider } from './omni-projection.catalog.js';
import type { OmniProjectionLifecycleProvider } from './omni-projection.lifecycle.js';
export interface OmniExtensionProjectionGraphqlNames {
    object: string;
    create: string;
    patch: string;
    conditions: string;
}
export interface OmniExtensionProjectionRegistrationOptions<Extension extends ObjectLiteral, Api extends ObjectLiteral> {
    /** The dynamically created class from createOmniExtensionProjectionEntity. */
    entity: EntityTarget<Extension>;
    /** API-only model used by CrudGen to derive operation names and tokens. */
    apiModel: ClassType<Api>;
    definition: OmniExtensionProjectionDefinition;
    /** Shared catalog provider, normally built from all returned registrations. */
    catalog?: OmniProjectionReaderCatalogProvider;
    /** Request-scoped app policy shared by generated REST and GraphQL. */
    lifecycle?: OmniProjectionLifecycleProvider<OmniExtensionProjectionDefinition, Extension>;
    dbConnection: string;
    rest?: {
        path?: string;
    };
    graphql?: {
        prefix?: string;
        names?: OmniExtensionProjectionGraphqlNames;
    };
    /** Optional consumer-owned ModuleRef token for generated GraphQL DI. */
    moduleRefToken?: InjectionToken;
}
export interface OmniExtensionProjectionRegistration<Extension extends ObjectLiteral, Api extends ObjectLiteral> {
    /** Immutable source contract shared by service, transport, and migrations. */
    definition: OmniExtensionProjectionDefinition;
    /** Register these entities with TypeOrmModule.forFeature in the app module. */
    entities: readonly EntityTarget<Extension>[];
    /** Pass these into OmniKernelModule.register({ reservedRecordKinds }) . */
    reservedRecordKinds: readonly string[];
    /** Include this in createOmniProjectionReaderCatalog([...]). */
    reader: OmniExtensionProjectionReaderRegistration<Extension>;
    /** Generated GraphQL classes, useful when composing additional schema. */
    graphqlTypes: ProjectionGraphqlTypes;
    resource: ICrudGenResourceFactoryResult<Api>;
    controllers: readonly ClassType[];
    providers: readonly Provider[];
    serviceToken: string;
    dataLoaderToken: string;
}
/**
 * Composes the standard CrudGen REST and GraphQL surfaces for one Omni-owned
 * extension. It deliberately supplies no handwritten controller or resolver:
 * consumers register the returned controllers/providers alongside their
 * trusted OmniKernel scope module and TypeOrmModule.forFeature entities.
 */
export declare function createOmniExtensionProjectionRegistration<Extension extends ObjectLiteral, Api extends ObjectLiteral>(options: OmniExtensionProjectionRegistrationOptions<Extension, Api>): OmniExtensionProjectionRegistration<Extension, Api>;
