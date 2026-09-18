"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumValueByEnumKey = exports.mergeEnums = exports.belongsToEnum = void 0;
const belongsToEnum = (enumObj, value) => {
    return Object.values(enumObj).includes(value);
};
exports.belongsToEnum = belongsToEnum;
const mergeEnums = (...enums) => {
    let merged = {};
    enums.forEach((e) => (merged = { ...merged, ...e }));
    return merged;
};
exports.mergeEnums = mergeEnums;
const getEnumValueByEnumKey = (myEnum, enumKey) => {
    if (!enumKey)
        return undefined;
    const idx = Object.keys(myEnum).find((x) => x === enumKey);
    return idx ? myEnum[idx] : undefined;
};
exports.getEnumValueByEnumKey = getEnumValueByEnumKey;
//# sourceMappingURL=enum.helper.js.map