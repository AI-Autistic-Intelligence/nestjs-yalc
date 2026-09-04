import { CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
import { FilterInput } from './ag-grid.interface';
export declare class FilterScalar implements CustomScalar<string, FilterInput> {
    description: string;
    resultMemoize: Map<any, any>;
    resultMemoizeInverse: WeakMap<WeakKey, any>;
    parseValue(value: any): FilterInput;
    serialize(value: any): string;
    parseLiteral(ast: ValueNode): FilterInput;
}
