import { CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
import { FilterInput } from './api-graphql/crud-gen-gql.interface.js';
export declare class FilterScalar implements CustomScalar<string, FilterInput> {
    description: string;
    resultMemoize: Map<any, any>;
    resultMemoizeInverse: WeakMap<WeakKey, any>;
    parseValue(value: string | unknown): FilterInput;
    serialize(value: FilterInput | string | unknown): string;
    parseLiteral(ast: ValueNode): FilterInput;
}
