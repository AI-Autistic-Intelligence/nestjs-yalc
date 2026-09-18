import { type InjectionToken, type Provider } from '@nestjs/common';
import { type ICrudGenResourceFactoryResult, type ProjectionGraphqlTypes } from '@nest-yalc-2/crud-gen';
import type { ClassType } from '@node-yalc/types/globals';
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
    entity: EntityTarget<Extension>;
    apiModel: ClassType<Api>;
    definition: OmniExtensionProjectionDefinition;
    catalog?: OmniProjectionReaderCatalogProvider;
    lifecycle?: OmniProjectionLifecycleProvider<OmniExtensionProjectionDefinition, Extension>;
    dbConnection: string;
    rest?: {
        path?: string;
    };
    graphql?: {
        prefix?: string;
        names?: OmniExtensionProjectionGraphqlNames;
    };
    moduleRefToken?: InjectionToken;
}
export interface OmniExtensionProjectionRegistration<Extension extends ObjectLiteral, Api extends ObjectLiteral> {
    definition: OmniExtensionProjectionDefinition;
    entities: readonly EntityTarget<Extension>[];
    reservedRecordKinds: readonly string[];
    reader: OmniExtensionProjectionReaderRegistration<Extension>;
    graphqlTypes: ProjectionGraphqlTypes;
    resource: ICrudGenResourceFactoryResult<Api>;
    controllers: readonly ClassType[];
    providers: readonly Provider[];
    serviceToken: string;
    dataLoaderToken: string;
}
export declare function createOmniExtensionProjectionRegistration<Extension extends ObjectLiteral, Api extends ObjectLiteral>(options: OmniExtensionProjectionRegistrationOptions<Extension, Api>): OmniExtensionProjectionRegistration<Extension, Api>;
