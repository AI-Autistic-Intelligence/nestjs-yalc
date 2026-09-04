export const returnValue = (value) => {
    return () => value;
};
export const returnProperty = (property) => {
    return (relationEntity) => relationEntity[property];
};
export default returnValue;
//# sourceMappingURL=returnValue.js.map