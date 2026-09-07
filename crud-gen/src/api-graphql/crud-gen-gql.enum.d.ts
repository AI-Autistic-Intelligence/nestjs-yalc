import { AnyFunction, ClassType } from '@nest-yalc-2/types/globals.d.js';
export declare function entityFieldsEnumGqlFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
