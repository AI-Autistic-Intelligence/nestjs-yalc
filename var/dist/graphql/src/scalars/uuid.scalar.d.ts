import { CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
export declare class UUIDScalar implements CustomScalar<string, string> {
    description: string;
    parseValue(value: any): string;
    serialize(value: any): string;
    parseLiteral(ast: ValueNode): string;
}
export declare function formatValueErrorMessage(id: string): string;
export declare function formatKindErrorMessage(kind: string): string;
export declare function validateUUID(uuid: string): boolean;
