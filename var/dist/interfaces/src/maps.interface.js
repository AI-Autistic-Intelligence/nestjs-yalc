export const isFieldMapper = (object) => {
    const casted = object;
    const values = Object.values(casted);
    return values.length > 0 && values.every((p) => !!p.dst);
};
export const isFieldMapperProperty = (object) => {
    return object && !!object.dst;
};
//# sourceMappingURL=maps.interface.js.map