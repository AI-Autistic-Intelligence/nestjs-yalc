import { Type } from '@nestjs/common';
import { FindManyOptions, FindOperator, ObjectLiteral } from 'typeorm';
import { IExtraArg, ICombinedWhereModel } from './crud-gen-gql.interface.js';
import { Operators } from '../crud-gen.enum.js';
import { FieldMapperProperty } from '@node-yalc/interfaces';
import { IModelFieldMetadata } from '../object.decorator.js';
import { IConnection, IPageDataCrudGen } from '../crud-gen.interface.js';
export declare class PageDataCrudGenGql implements IPageDataCrudGen {
    count: number;
    startRow: number;
    endRow: number;
}
export interface IConnectionGql extends IConnection {
    pageData: PageDataCrudGenGql;
}
export declare const typeMap: {
    [key: string]: {
        new (name: string): IConnectionGql;
    };
};
export default function CrudGenGqlType<T>(type: Type<T>): any;
export type findOperatorTypes = string | number | Date | undefined | null;
export interface IGqlSelectedFields<T> {
    fields: (keyof T)[];
}
export interface ICrudGenArgs<T> extends FindManyOptions, IGqlSelectedFields<T> {
}
export interface RecursiveFindOperator<T> {
    [index: number]: RecursiveFindOperator<T> | FindOperator<T>;
    length: number;
}
export interface RecursiveAndFindOperator<T> {
    condition_1?: RecursiveAndFindOperator<T> | FindOperator<T>;
    condition_2?: RecursiveAndFindOperator<T> | FindOperator<T>;
}
export type IWhereConditionType = FindOperator<findOperatorTypes> | FindOperator<findOperatorTypes>[] | RecursiveFindOperator<findOperatorTypes> | RecursiveFindOperator<findOperatorTypes>[] | RecursiveAndFindOperator<findOperatorTypes> | RecursiveAndFindOperator<findOperatorTypes>[] | ICombinedWhereModel;
export type IWhereFilters<Entity extends ObjectLiteral> = Partial<{
    [key in keyof Entity]: IWhereConditionType;
}>;
export interface IWhereCondition<Entity extends ObjectLiteral = any> {
    operator?: Operators;
    filters: IWhereFilters<Entity>;
    childExpressions?: IWhereCondition<Entity>[];
}
export interface IFilterArg {
    key: string;
    value: findOperatorTypes;
    descriptors?: IExtraArg;
}
export interface ISelect {
    field: string;
    isRaw?: boolean;
    isNested?: boolean;
}
export interface IKeyMeta {
    fieldMapper: FieldMapperProperty | IModelFieldMetadata;
    isNested?: boolean;
    rawSelect: string;
}
