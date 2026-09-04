"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayGroupByField = void 0;
const arrayGroupByField = (entityArray, getKey) => {
    return entityArray.reduce((acc, current) => {
        var _a;
        const property = getKey(current);
        (_a = acc[property]) !== null && _a !== void 0 ? _a : (acc[property] = []);
        acc[property].push(current);
        return acc;
    }, {});
};
exports.arrayGroupByField = arrayGroupByField;
//# sourceMappingURL=data-structure.helper.js.map