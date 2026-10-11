import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
export declare class KafkaController<Entity extends ObjectLiteral> {
    protected repository: Repository<Entity>;
    constructor(repository: Repository<Entity>);
    /**
     * Check function for filtering target with specific value on a key
     * @param target Entity
     * @param key Key of the Entity fields
     * @param value Value to filter
     * @returns true if match - false otherwise
     */
    checkTargetValue<Entity, U extends keyof Entity>(target: Entity, key: U, value: Array<Entity[U]>): boolean;
    /**
     * Save entity on Database
     * @param entity
     * @returns
     */
    saveEntity(entity: QueryDeepPartialEntity<Entity>): Promise<import("typeorm").InsertResult>;
    /**
     * Save the entity or Update in case of confitColumn
     * @param entity
     * @param overWrite
     * @param conflitTarget
     * @returns
     */
    saveEntityOrUpdate(entity: QueryDeepPartialEntity<Entity>, overWrite: string[], conflitTarget?: string | string[]): Promise<import("typeorm").InsertResult>;
    /**
     * Delete the entity
     * @param conditions
     * @returns
     */
    deleteEntity(conditions: FindOptionsWhere<Entity>): Promise<import("typeorm").DeleteResult>;
}
