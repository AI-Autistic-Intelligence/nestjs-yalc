import { FilterInput } from './ag-grid.interface';
import { SortModelStrict, JoinArgOptions } from './ag-grid.input';
import { ClassType } from '@nestjs-yalc/types';
export interface AgQueryParams<T = unknown> {
    [index: string]: unknown;
    startRow?: number;
    endRow?: number;
    sorting?: SortModelStrict<T>[];
    filters?: FilterInput;
    join?: {
        [index: string]: JoinArgOptions;
    };
}
export declare const typeMap: WeakMap<WeakKey, any>;
export declare function agQueryParamsFactory(defaultValues?: AgQueryParams, entityModel?: ClassType): {
    new (): AgQueryParams;
};
export declare function agQueryParamsNoPaginationFactory(defaultValues?: AgQueryParams, entityModel?: ClassType): {
    new (): AgQueryParams;
};
