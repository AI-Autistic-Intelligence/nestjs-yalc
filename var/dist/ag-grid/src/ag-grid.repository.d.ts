import { ReplicationMode } from '@nest-yalc-2/database/query-builder.helper';
import { FieldMapper } from '@nest-yalc-2/interfaces/maps.interface';
import { ClassType } from '@nest-yalc-2/types';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { AgGridFindManyOptions } from './ag-grid.interface';
import { WhereFilters } from './ag-grid.type';
import './query-builder.helpers';
export declare const AG_GRID_MAIN_ALIAS = "AgGridMainAlias";
export declare class AgGridRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    protected entity: EntityClassOrSchema;
    getActualLimits(findOptions: AgGridFindManyOptions<Entity>): {
        skip?: number;
        take?: number;
    };
    getFormattedAgGridQueryBuilder(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }, qb?: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity>;
    getAgGridQueryBuilder(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): SelectQueryBuilder<Entity>;
    getManyAndCountAgGrid(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): Promise<[Entity[], number]>;
    getManyAgGrid(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): Promise<Entity[]>;
    getOneAgGrid(findOptions: AgGridFindManyOptions<Entity>, withFail?: boolean, mode?: ReplicationMode): Promise<Entity>;
    private getOneOrFail;
    generateFilterOnPrimaryColumn(ids: any): WhereFilters;
    generateSelectOnFind(fields: (keyof Entity)[], gqlType: ClassType<Entity>): AgGridFindManyOptions<unknown>;
}
export declare function AgGridRepositoryFactory<Entity extends ObjectLiteral>(entity: ClassType<Entity>): ClassType<AgGridRepository<Entity>>;
