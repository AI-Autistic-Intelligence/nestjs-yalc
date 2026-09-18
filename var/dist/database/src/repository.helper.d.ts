import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Connection } from 'typeorm';
export declare class RepositoryHelper {
    static getCustomRepository<Entity extends EntityClassOrSchema>(connection: Connection, entity: Entity): any;
}
