"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlError = exports.GqlErrorMsgs = void 0;
var GqlErrorMsgs;
(function (GqlErrorMsgs) {
    GqlErrorMsgs["MAX_OPERATIONS"] = "The request has too many operations.";
    GqlErrorMsgs["MAX_DEPTH"] = "The request has reached the max depth allowed.";
    GqlErrorMsgs["CIRCULAR_DEPENDENCY_FOUND"] = "The request has a circular dependency.";
})(GqlErrorMsgs || (exports.GqlErrorMsgs = GqlErrorMsgs = {}));
class GqlError extends Error {
    constructor(message, systemMessage) {
        super(message);
        this.systemMessage = systemMessage;
    }
}
exports.GqlError = GqlError;
//# sourceMappingURL=gql.error.js.map