import { AnyFunction, ClassType } from '@node-yalc/types/globals';
export declare function entityFieldsEnumGqlFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
