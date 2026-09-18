import type { ClassType } from '@node-yalc/types/globals';
import { SortDirection } from '../crud-gen.enum.js';
import type { ICrudGenBaseParams, ICrudGenSimpleParams, FilterInput, ISortModel, ISortModelStrict } from '../api-graphql/crud-gen-gql.interface.js';
import { IPageDataCrudGen } from '../crud-gen.interface.js';
declare const CGQueryDto_base: {
    new (...args: any[]): {
        [x: string]: any;
        startRow?: number;
        endRow?: number;
    };
};
export declare class CGQueryDto<T = any> extends CGQueryDto_base implements ICrudGenBaseParams<T> {
}
export declare class SortModelRest<T = any> implements ISortModel<T> {
    colId: string;
    sort: SortDirection;
}
export declare function sortModelRestFactory<Entity>(entityModel: ClassType<Entity>): any;
export declare const typeMap: WeakMap<object, any>;
export declare function crudGenRestParamsFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
export declare function crudGenRestParamsNoPaginationFactory(defaultValues?: ICrudGenBaseParams, entityModel?: ClassType): {
    new (): ICrudGenBaseParams;
};
export declare class PageData implements IPageDataCrudGen {
    count: number;
    startRow: number;
    endRow: number;
}
export declare class PaginatedResultDto<T> {
    list: T[];
    pageData: PageData;
    constructor(list: T[], pageData: PageData);
}
declare const CGRestQueryArgs_base: {
    new (...args: any[]): {
        [x: string]: any;
        startRow?: number;
        endRow?: number;
    };
};
export declare class CGRestQueryArgs<T = any> extends CGRestQueryArgs_base implements ICrudGenSimpleParams<T> {
    sorting?: ISortModelStrict<T>[];
    filters?: FilterInput;
}
export declare function PaginationDTOMixin(base?: ClassType): {
    new (...args: any[]): {
        [x: string]: any;
        startRow?: number;
        endRow?: number;
    };
};
export {};
