import { FieldMiddleware } from '@nestjs/graphql';
/**
 * Parses an invalid or empty timestamp to null to avoid GraphQLISODateTime parsing issues
 */
export declare const nullableTimestampMiddleware: FieldMiddleware;
