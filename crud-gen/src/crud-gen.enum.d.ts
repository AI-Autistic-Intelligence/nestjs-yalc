export * from '@node-yalc/datagrid/ag-grid.enum.js';
import { AnyFunction, ClassType } from '@node-yalc/types/globals.js';
export declare function entityFieldsEnumFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    enum: {
        [index: string]: string;
    };
    cached: boolean;
    prototype: any;
};
