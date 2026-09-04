import { ExecutionContext, Type } from '@nestjs/common';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { IFieldMapper } from '@nestjs-yalc/interfaces/maps.interface.js';
import { ClassType } from '@nestjs-yalc/types/globals.d.js';
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
export declare const GqlInfoGenerator: (data: IFieldMapper | ReturnTypeFuncValue | ClassType, ctx: ExecutionContext) => string[];
export declare const GqlFieldsMap: (...dataOrPipes: any[]) => ParameterDecorator;
