import { GraphQLSchema } from 'graphql';
export declare class AppContextService {
    initializedApps: Set<string>;
    private graphQLSchema;
    setSchema(schema: GraphQLSchema): void;
    get schema(): GraphQLSchema;
}
