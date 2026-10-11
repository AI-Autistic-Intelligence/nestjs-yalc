import type { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import type { OmniScope } from './omni-scope.js';
/**
 * Small repository facade for normal Omni lookups. It mechanically adds the
 * current scope and is the supported lower-level alternative to passing raw
 * repositories between application layers.
 */
export declare class OmniScopedRepository<Entity extends ObjectLiteral> {
    private readonly repository;
    private readonly scope;
    constructor(repository: Repository<Entity>, scope: OmniScope);
    where(where?: FindOptionsWhere<Entity>): FindOptionsWhere<Entity>;
    findOneByGuid(guid: string): Promise<Entity | null>;
    find(where?: FindOptionsWhere<Entity>): Promise<Entity[]>;
}
