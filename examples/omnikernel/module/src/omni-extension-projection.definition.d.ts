import { type ProjectionDialect, type ProjectionResourceDefinition } from '@nest-yalc-2/crud-gen';
import { Table, type EntityTarget, type ObjectLiteral } from 'typeorm';
import { OmniRecordStatus } from './omni-record-status.enum.js';
export interface OmniExtensionProjectionDefinition extends ProjectionResourceDefinition {
    /**
     * Immutable metadata written only to the Omni record that owns every
     * extension row. The extension table never mirrors these values.
     */
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
/**
 * Defines an owner-extension projection. The inherited projection metadata
 * remains the single source for public fields, codecs, JSON paths, and query
 * capabilities; the extra owner block fixes Omni record metadata server-side.
 */
export declare function defineOmniExtensionProjection<TDefinition extends OmniExtensionProjectionDefinition>(definition: TDefinition): Readonly<TDefinition>;
/**
 * Builds a TypeORM entity target for one extension table. This is deliberately
 * a decorated class, rather than an EntitySchema: TypeORM builds EntitySchema
 * metadata separately and cannot resolve an EntitySchema foreign key to the
 * decorated OmniRecordEntity. The generated class keeps both sides in the
 * same metadata pass, allowing the composite FK to be synchronized normally.
 */
export declare function createOmniExtensionProjectionEntity<Extension extends ObjectLiteral>(definition: OmniExtensionProjectionDefinition, dialect: ProjectionDialect): EntityTarget<Extension>;
/**
 * Creates reviewed-migration DDL for an extension table. Applications pass
 * the returned Table to QueryRunner.createTable; runtime CRUD never creates
 * schema objects. JSON storage remains a ProjectionDialect concern.
 */
export declare function createOmniExtensionProjectionTable(definition: OmniExtensionProjectionDefinition, dialect: ProjectionDialect): Table;
