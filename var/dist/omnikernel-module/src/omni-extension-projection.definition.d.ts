import { type ProjectionDialect, type ProjectionResourceDefinition } from '@nest-yalc-2/crud-gen';
import { Table, type EntityTarget, type ObjectLiteral } from 'typeorm';
import { OmniRecordStatus } from './omni-record-status.enum.js';
export interface OmniExtensionProjectionDefinition extends ProjectionResourceDefinition {
    owner: {
        kind: string;
        title: string;
        status: OmniRecordStatus;
        schema: {
            id: string;
            version: number;
        };
    };
}
export declare function defineOmniExtensionProjection<TDefinition extends OmniExtensionProjectionDefinition>(definition: TDefinition): Readonly<TDefinition>;
export declare function createOmniExtensionProjectionEntity<Extension extends ObjectLiteral>(definition: OmniExtensionProjectionDefinition, dialect: ProjectionDialect): EntityTarget<Extension>;
export declare function createOmniExtensionProjectionTable(definition: OmniExtensionProjectionDefinition, dialect: ProjectionDialect): Table;
