import { ExecutionContext, Type } from '@nestjs/common';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { IFieldMapper } from '@nest-yalc-2/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals';
import { GraphQLResolveInfo } from 'graphql';
import { IKeyMeta } from './crud-gen-gql.type.js';
export interface IGqlAgSingleParams {
    id: Type<any>;
}
export declare const GqlModelFieldsMapper: (data: IFieldMapper | ReturnTypeFuncValue | ClassType, info: GraphQLResolveInfo) => {
    keys: string[];
    keysMeta: {
        [key: string]: IKeyMeta;
    };
};
export declare const GqlInfoGenerator: (data: (IFieldMapper | ReturnTypeFuncValue | ClassType) | undefined, ctx: ExecutionContext) => string[];
export declare const GqlFieldsMap: (...dataOrPipes: (ClassType | IFieldMapper<any> | ReturnTypeFuncValue | import("@nestjs/common").PipeTransform<any, any> | Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
