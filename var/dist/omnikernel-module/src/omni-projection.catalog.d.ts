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
        where?: Readonly<Record<string, unknown>>;
        take?: number;
    }): Promise<Entity[]>;
}
export interface OmniRelationProjectionReader {
    get(guid: string): Promise<OmniRelationEntity | undefined>;
    list(options?: {
        sourceRecordId?: string;
        targetRecordId?: string;
        take?: number;
    }): Promise<OmniRelationEntity[]>;
}
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
export declare const OMNI_PROJECTION_READER_CATALOG: unique symbol;
export declare function createOmniProjectionReaderCatalog(registrations: readonly (OmniProjectionReaderRegistration | OmniProjectionReaderCatalogSource)[]): OmniProjectionReaderCatalog;
export declare function createOmniProjectionReaderCatalogProvider(registrations: readonly (OmniProjectionReaderRegistration | OmniProjectionReaderCatalogSource)[], token?: InjectionToken<OmniProjectionReaderCatalog>): Provider;
