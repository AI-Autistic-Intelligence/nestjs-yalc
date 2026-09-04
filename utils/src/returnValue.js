"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnProperty = void 0;
exports.returnValue = returnValue;
exports.returnAsyncValue = returnAsyncValue;
function returnValue(value) {
    return () => value;
}
function returnAsyncValue(value) {
    return async () => value;
}
const returnProperty = (property) => {
    return (relationEntity) => relationEntity[property];
};
exports.returnProperty = returnProperty;
exports.default = returnValue;
//# sourceMappingURL=returnValue.js.map