"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapIntoObservable = wrapIntoObservable;
exports.wrapIntoAnOperator = wrapIntoAnOperator;
exports.switchTap = switchTap;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const node_util_1 = tslib_1.__importDefault(require("node:util"));
function wrapIntoObservable(input) {
    if (input === null || input === undefined) {
        return rxjs_1.EMPTY;
    }
    if (node_util_1.default.types.isAsyncFunction(input)) {
        return (0, rxjs_1.from)(input());
    }
    if ((0, rxjs_1.isObservable)(input)) {
        return input;
    }
    return (0, rxjs_1.of)(input);
}
function wrapIntoAnOperator(input) {
    if (node_util_1.default.types.isAsyncFunction(input)) {
        return (0, operators_1.mergeMap)(input);
    }
    return input;
}
function switchTap(project) {
    return (input) => input.pipe((0, operators_1.switchMap)((value, index) => (0, rxjs_1.combineLatest)([(0, rxjs_1.of)(value), project(value, index)])), (0, operators_1.map)(([intialValue, projectedValue]) => projectedValue !== undefined ? projectedValue : intialValue));
}
//# sourceMappingURL=rxjs.helper.js.map