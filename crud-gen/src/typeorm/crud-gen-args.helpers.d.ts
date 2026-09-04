import { IFieldMapper } from '@nestjs-yalc/interfaces';
import { FindOperator, ObjectLiteral, FindOptionsOrder } from 'typeorm';
import { FilterType } from '../crud-gen.enum.js';
import { FilterModel, ICombinedSimpleModel, ICombinedWhereModel, ISimpleFilterModel, DateFilterModel, ISetFilterModel, FilterInput, CrudGenFindManyOptions, ICrudGenBaseParams, ICrudGenArgsOptions, ISortModelStrict } from '../api-graphql/crud-gen-gql.interface.js';
import { IWhereConditionType, IWhereCondition, IKeyMeta } from '../api-graphql/crud-gen-gql.type.js';
import { FilterOption } from '../object.decorator.js';
export declare function getTextFilter(filter: string, firstParameter: string): FindOperator<string>;
export declare function getNumberFilter(filter: string, firstParameter: number, secondParameter?: number): FindOperator<number>;
export declare function getDateFilter(filter: string, firstParameter: string, secondParameter?: string): FindOperator<string>;
export declare function filterSwitch(filter: FilterModel, filterName?: string): FindOperator<number | string | Date | null>;
export declare function getFindOperator(filterType: FilterType, filterName: string, arg1: any, arg2?: any): FindOperator<number | string | Date | null>;
export declare function convertFilter(filter: FilterModel | ICombinedSimpleModel): FindOperator<string | number | Date | null> | ICombinedWhereModel;
export declare function resolveFilter(filter: ICombinedSimpleModel | ISimpleFilterModel | DateFilterModel | ISetFilterModel): IWhereConditionType;
export declare function createWhere(filtersObject: FilterInput, fieldMapper: IFieldMapper | undefined, alias?: string, where?: IWhereCondition): IWhereCondition;
export declare function removeSymbolicSelection(select: string[], data: IFieldMapper | undefined, path: string): string[];
export declare function checkFilterScope(where: IWhereCondition, filterOption: FilterOption): void;
export declare function mapCrudGenParam<Entity extends ObjectLiteral>(params: ICrudGenArgsOptions | undefined, select: {
    keys: string[];
    keysMeta?: {
        [key: string]: IKeyMeta;
    };
}, args: ICrudGenBaseParams, options?: {
    isCount?: boolean;
}): CrudGenFindManyOptions<any>;
export declare function mapPaginationParamsToTypeORM(startRow?: number, endRow?: number, maxRow?: number): {
    skip: number;
    take: number;
};
export declare function mapSortingParamsToTypeORM<TInputType = any, TEntityType = any>(sorting: ISortModelStrict<TInputType>[], transform?: (col: keyof TInputType) => keyof TEntityType): FindOptionsOrder<TEntityType>;
