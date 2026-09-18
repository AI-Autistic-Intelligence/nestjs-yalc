import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
export declare class KafkaController<Entity extends ObjectLiteral> {
    protected repository: Repository<Entity>;
    constructor(repository: Repository<Entity>);
    checkTargetValue<Entity, U extends keyof Entity>(target: Entity, key: U, value: Array<Entity[U]>): boolean;
    saveEntity(entity: QueryDeepPartialEntity<Entity>): Promise<import("typeorm").InsertResult>;
    saveEntityOrUpdate(entity: QueryDeepPartialEntity<Entity>, overWrite: string[], conflitTarget?: string | string[]): Promise<import("typeorm").InsertResult>;
    deleteEntity(conditions: FindOptionsWhere<Entity>): Promise<import("typeorm").DeleteResult>;
}
