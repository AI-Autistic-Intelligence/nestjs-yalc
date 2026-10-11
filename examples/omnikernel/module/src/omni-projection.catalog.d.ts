import type { InjectionToken, Provider } from '@nestjs/common';
import { type EntityManager, type EntityTarget, type ObjectLiteral } from 'typeorm';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import type { OmniExtensionProjectionDefinition } from './omni-extension-projection.definition.js';
import { type OmniRelationProjectionDefinition } from './omni-relation-projection.definition.js';
import type { OmniScope } from './omni-scope.js';
export interface OmniExtensionProjectionReaderRegistration<Entity extends ObjectLiteral = ObjectLiteral> {
    readonly type: 'extension';
    readonly id: string;
    readonly entity: EntityTarget<Entity>;
    readonly definition: OmniExtensionProjectionDefinition;
}
export interface OmniRelationProjectionReaderRegistration {
    readonly type: 'relation';
    readonly id: string;
    readonly definition: OmniRelationProjectionDefinition;
}
export type OmniProjectionReaderRegistration = OmniExtensionProjectionReaderRegistration | OmniRelationProjectionReaderRegistration;
export interface OmniExtensionProjectionReader<Entity extends ObjectLiteral = ObjectLiteral> {
    get(guid: string): Promise<Entity | undefined>;
    list(options?: {
        /** Equality only, on declared fields that explicitly allow eq filtering. */
        where?: Readonly<Record<string, unknown>>;
        /** A bounded result size; policies commonly use take: 1 for existence. */
        take?: number;
    }): Promise<Entity[]>;
}
export interface OmniRelationProjectionReader {
    get(guid: string): Promise<OmniRelationEntity | undefined>;
    list(options?: {
        sourceRecordId?: string;
        targetRecordId?: string;
        /** A bounded result size for edge-existence checks. */
        take?: number;
    }): Promise<OmniRelationEntity[]>;
}
/**
 * Manager-bound readers available to a lifecycle policy. They intentionally
 * expose projection identities and constrained graph records, never TypeORM
 * repositories or query runners.
 */
export interface OmniProjectionTransactionReaders {
    extension<Entity extends ObjectLiteral = ObjectLiteral>(id: string): OmniExtensionProjectionReader<Entity>;
    relation(id: string): OmniRelationProjectionReader;
}
export interface OmniProjectionReaderCatalog {
    bind(manager: EntityManager, scope: OmniScope): OmniProjectionTransactionReaders;
}
export interface OmniProjectionReaderCatalogProvider {
    readonly token: InjectionToken<OmniProjectionReaderCatalog>;
}
export interface OmniProjectionReaderCatalogSource {
    readonly reader: OmniProjectionReaderRegistration;
}
/** Default token for a composed set of generated Omni projection resources. */
export declare const OMNI_PROJECTION_READER_CATALOG: unique symbol;
/**
 * Creates an immutable catalog from resource registrations. It has no global
 * state: each hook binds the catalog to its active transaction manager.
 */
export declare function createOmniProjectionReaderCatalog(registrations: readonly (OmniProjectionReaderRegistration | OmniProjectionReaderCatalogSource)[]): OmniProjectionReaderCatalog;
/**
 * Creates the one Nest provider shared by lifecycle-enabled registrations.
 * Call it after creating the individual resource registrations, passing those
 * registrations directly; the catalog captures their immutable reader entries.
 */
export declare function createOmniProjectionReaderCatalogProvider(registrations: readonly (OmniProjectionReaderRegistration | OmniProjectionReaderCatalogSource)[], token?: InjectionToken<OmniProjectionReaderCatalog>): Provider;
