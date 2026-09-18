"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLambdaCliOperation = runLambdaCliOperation;
async function runLambdaCliOperation(method, message) {
    try {
        await method();
    }
    catch (error) {
        return Promise.reject(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message,
        }),
    };
}
//# sourceMappingURL=aws-lambda.helpers.js.map