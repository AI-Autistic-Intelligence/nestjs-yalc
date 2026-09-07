import { IFieldMapper } from '@nest-yalc-2/interfaces/maps.interface.js';
import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { ExecutionContext } from '@nestjs/common';
import { ArgsOptions, ReturnTypeFuncValue } from '@nestjs/graphql';
import { ObjectLiteral } from 'typeorm';
interface IInputArgsOptions {
    gql?: ArgsOptions;
    fieldMap?: IFieldMapper | undefined;
    fieldType?: ClassType | ReturnTypeFuncValue;
    _name?: string;
}
export declare const GqlFieldsAsArgsWorker: (data: IFieldMapper, info: ObjectLiteral) => ObjectLiteral;
export declare const GqlArgsGenerator: (data: IInputArgsOptions, ctx: ExecutionContext) => any;
export declare const InputArgsMapper: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | IInputArgsOptions)[]) => ParameterDecorator;
export declare const InputArgs: (params: IInputArgsOptions) => (target: any, key: string, index: number) => void;
export {};
