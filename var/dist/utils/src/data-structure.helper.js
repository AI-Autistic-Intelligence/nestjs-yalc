export const arrayGroupByField = (entityArray, getKey) => {
    return entityArray.reduce((acc, current) => {
        const property = getKey(current);
        acc[property] ??= [];
        acc[property].push(current);
        return acc;
    }, {});
};
//# sourceMappingURL=data-structure.helper.js.map