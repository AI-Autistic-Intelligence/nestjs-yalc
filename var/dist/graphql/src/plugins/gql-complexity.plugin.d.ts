import { GraphQLRequestListener, ApolloServerPlugin } from '@apollo/server';
export declare class GqlComplexityPlugin implements ApolloServerPlugin {
    requestDidStart(): Promise<GraphQLRequestListener<any>>;
}
