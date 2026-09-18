"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayGroupByField = void 0;
const arrayGroupByField = (entityArray, getKey) => {
    return entityArray.reduce((acc, current) => {
        const property = getKey(current);
        acc[property] ??= [];
        acc[property].push(current);
        return acc;
    }, {});
};
exports.arrayGroupByField = arrayGroupByField;
//# sourceMappingURL=data-structure.helper.js.map