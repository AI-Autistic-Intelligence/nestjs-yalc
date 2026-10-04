import { EntitySchema } from 'typeorm';
type EntityClassOrSchema = Function | EntitySchema;
import { Connection } from 'typeorm';
export declare class RepositoryHelper {
    static getCustomRepository<Entity extends EntityClassOrSchema>(connection: Connection, entity: Entity): any;
}
export {};
