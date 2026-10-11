import { FieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types';
import { ExecutionContext } from '@nestjs/common';
import { ArgsOptions, ReturnTypeFuncValue } from '@nestjs/graphql';
import { ObjectLiteral } from 'typeorm';
interface InputArgsOptions {
    /**
     * @property Options for the nestjs Args decorator
     */
    gql?: ArgsOptions;
    /**
     * @property fieldMap is used internally to convert names of exposed fields to database fields
     * @deprecated use fieldType instead
     */
    fieldMap?: FieldMapper | undefined;
    /**
     * @property fieldType is used internally to retrieve information about the returned type
     */
    fieldType?: ClassType | ReturnTypeFuncValue;
    /**
     * @property the input property name, by default is 'input'
     */
    _name?: string;
}
export declare const GqlFieldsAsArgsWorker: (data: FieldMapper, info: ObjectLiteral) => ObjectLiteral;
export declare const GqlArgsGenerator: (data: InputArgsOptions, ctx: ExecutionContext) => any;
export declare const InputArgsMapper: (...dataOrPipes: (import("@nestjs/common", { with: { "resolution-mode": "import" } }).ParameterDecoratorOptions | import("@nestjs/common", { with: { "resolution-mode": "import" } }).PipeTransform<any, any> | import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/common", { with: { "resolution-mode": "import" } }).PipeTransform<any, any>> | InputArgsOptions)[]) => ParameterDecorator;
/**
 * This decorator declare the Args name for the playground, at the same time it applies the fieldMap to the Object
 * @returns the mapped params in the input object
 */
export declare const InputArgs: (params: InputArgsOptions) => (target: object, key: string | symbol, index: number) => void;
export {};
