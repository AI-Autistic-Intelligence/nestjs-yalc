import { AnyFunction, ClassType } from '@nestjs-yalc/types/globals.d.js';
export declare function entityFieldsEnumGqlFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
