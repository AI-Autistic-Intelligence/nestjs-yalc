export declare class GqlComplexityPlugin {
    requestDidStart(): Promise<{
        didResolveOperation({ document, schema, }: {
            document: any;
            schema: any;
        }): Promise<void>;
    }>;
}
