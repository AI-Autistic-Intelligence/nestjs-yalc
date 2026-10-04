import { AnyFunction, ClassType } from '@node-yalc/types/globals.js';
export declare function entityFieldsEnumGqlFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
