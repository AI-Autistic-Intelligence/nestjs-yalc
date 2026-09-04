export var GqlErrorMsgs;
(function (GqlErrorMsgs) {
    GqlErrorMsgs["MAX_OPERATIONS"] = "The request has too many operations.";
    GqlErrorMsgs["MAX_DEPTH"] = "The request has reached the max depth allowed.";
    GqlErrorMsgs["CIRCULAR_DEPENDENCY_FOUND"] = "The request has a circular dependency.";
})(GqlErrorMsgs || (GqlErrorMsgs = {}));
export class GqlError extends Error {
    constructor(message, systemMessage) {
        super(message);
        this.systemMessage = systemMessage;
    }
}
//# sourceMappingURL=gql.error.js.map