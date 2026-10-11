import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals.js';
import { ExecutionContext } from '@nestjs/common';
import { ArgsOptions, ReturnTypeFuncValue } from '@nestjs/graphql';
import { ObjectLiteral } from 'typeorm';
interface IInputArgsOptions {
    /**
     * @property Options for the nestjs Args decorator
     */
    gql?: ArgsOptions;
    /**
     * @property fieldMap is used internally to convert names of exposed fields to database fields
     * @deprecated use fieldType instead
     */
    fieldMap?: IFieldMapper | undefined;
    /**
     * @property fieldType is used internally to retrieve information about the returned type
     */
    fieldType?: ClassType | ReturnTypeFuncValue;
    /**
     * @property the input property name, by default is 'input'
     */
    _name?: string;
}
export declare const GqlFieldsAsArgsWorker: (data: IFieldMapper, info: ObjectLiteral) => ObjectLiteral;
export declare const GqlArgsGenerator: (data: IInputArgsOptions, ctx: ExecutionContext) => any;
export declare const InputArgsMapper: (...dataOrPipes: (import("@nestjs/common").ParameterDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | IInputArgsOptions)[]) => ParameterDecorator;
/**
 * This decorator declare the Args name for the playground, at the same time it applies the fieldMap to the Object
 * @returns the mapped params in the input object
 */
export declare const InputArgs: (params: IInputArgsOptions) => (target: object, key: string | symbol, index: number) => void;
export {};
