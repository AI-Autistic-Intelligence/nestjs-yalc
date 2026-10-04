import { ExecutionContext, Type } from '@nestjs/common';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { FieldMapper, FieldMapperProperty } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals.js';
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
export declare const GqlInfoGenerator: (data: (FieldMapper | ReturnTypeFuncValue | ClassType) | undefined, ctx: ExecutionContext) => string[];
export declare const GqlFieldsMap: (...dataOrPipes: (ClassType | ReturnTypeFuncValue | import("@nestjs/common").PipeTransform<any, any> | Type<import("@nestjs/common").PipeTransform<any, any>> | import("@node-yalc/interfaces/maps.interface.js", { with: { "resolution-mode": "import" } }).IFieldMapper<any> | undefined)[]) => ParameterDecorator;
