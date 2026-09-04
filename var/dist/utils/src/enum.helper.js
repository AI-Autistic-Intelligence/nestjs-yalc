export const belongsToEnum = (enumObj, value) => {
    return Object.values(enumObj).includes(value);
};
export const mergeEnums = (...enums) => {
    let merged = {};
    enums.forEach((e) => (merged = { ...merged, ...e }));
    return merged;
};
//# sourceMappingURL=enum.helper.js.map