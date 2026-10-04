import { AnyFunction, ClassType } from '@node-yalc/types/globals.js';
import { GeneralFilters, FilterType, Operators, SortDirection, CustomWhereKeys, ExtraArgsStrategy, RowDefaultValues } from '@node-yalc/datagrid/ag-grid.enum.js';
export { GeneralFilters, FilterType, Operators, SortDirection, CustomWhereKeys, ExtraArgsStrategy, RowDefaultValues, };
export declare function entityFieldsEnumFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
