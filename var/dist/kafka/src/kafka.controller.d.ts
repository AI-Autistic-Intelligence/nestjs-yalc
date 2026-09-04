import { DeepPartial, FindOptionsWhere, Repository, ObjectLiteral } from 'typeorm';
export declare class KafkaController<Entity extends ObjectLiteral> {
    protected repository: Repository<Entity>;
    constructor(repository: Repository<Entity>);
    checkTargetValue<Entity, U extends keyof Entity>(target: Entity, key: U, value: Array<Entity[U]>): boolean;
    saveEntity(entity: DeepPartial<Entity>): Promise<import("typeorm").InsertResult>;
    saveEntityOrUpdate(entity: DeepPartial<Entity>, overWrite: string[], conflitTarget?: string | string[]): Promise<import("typeorm").InsertResult>;
    deleteEntity(conditions: FindOptionsWhere<Entity>): Promise<import("typeorm").DeleteResult>;
}
