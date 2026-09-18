import { ExecutionContext, Type } from '@nestjs/common';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { FieldMapper, FieldMapperProperty } from '@nest-yalc-2/interfaces/maps.interface';
import { ClassType } from '@nest-yalc-2/types/globals';
import { GraphQLResolveInfo } from 'graphql';
import { AgGridFieldMetadata } from './object.decorator';
export interface GqlAgSingleParams {
    id: Type<any>;
}
export interface KeyMeta {
    fieldMapper: FieldMapperProperty | AgGridFieldMetadata;
    isNested?: boolean;
    rawSelect: string;
}
export declare const GqlAgGridFieldsMapper: (data: FieldMapper | ReturnTypeFuncValue | ClassType, info: GraphQLResolveInfo) => {
    keys: string[];
    keysMeta: {
        [key: string]: KeyMeta;
    };
};
export declare const GqlInfoGenerator: (data: FieldMapper | ReturnTypeFuncValue | ClassType, ctx: ExecutionContext) => string[];
export declare const GqlFieldsMap: (...dataOrPipes: any[]) => ParameterDecorator;
