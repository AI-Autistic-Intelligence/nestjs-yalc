export declare function runLambdaCliOperation(method: (...args: any) => Promise<void>, message: string): Promise<{
    statusCode: number;
    body: string;
}>;
