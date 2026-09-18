import { FieldMapper } from '@node-yalc/interfaces/maps.interface';
import { ClassType } from '@node-yalc/types';
import { ExecutionContext } from '@nestjs/common';
import { ArgsOptions, ReturnTypeFuncValue } from '@nestjs/graphql';
import { ObjectLiteral } from 'typeorm';
interface InputArgsOptions {
    gql?: ArgsOptions;
    fieldMap?: FieldMapper | undefined;
    fieldType?: ClassType | ReturnTypeFuncValue;
    _name?: string;
}
export declare const GqlFieldsAsArgsWorker: (data: FieldMapper, info: ObjectLiteral) => ObjectLiteral;
export declare const GqlArgsGenerator: (data: InputArgsOptions, ctx: ExecutionContext) => any;
export declare const InputArgsMapper: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | InputArgsOptions)[]) => ParameterDecorator;
export declare const InputArgs: (params: InputArgsOptions) => (target: any, key: string, index: number) => void;
export {};
