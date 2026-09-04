import { FilterType, GeneralFilters, Operators } from './ag-grid.enum';
export function isFilterInputStrict(currentFilter) {
    return !isMulticolumnJoinOptions(currentFilter) && !isOperator(currentFilter);
}
export function isFilterModel(filter) {
    const casted = filter;
    return (isSetFilterModel(casted) ||
        (casted?.type !== undefined && casted.filterType !== undefined));
}
export function isTextFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isTextFilterModel(filter.condition1) &&
            isTextFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === FilterType.TEXT;
    }
}
export function isNumberFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isNumberFilterModel(filter.condition1) &&
            isNumberFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === FilterType.NUMBER;
    }
}
export function isSetFilterModel(filter) {
    if (!filter)
        return false;
    return filter.filterType === FilterType.SET;
}
export function isDateFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isDateFilterModel(filter.condition1) &&
            isDateFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === FilterType.DATE;
    }
}
export function isCombinedFilterModel(filter) {
    const casted = filter;
    return (casted &&
        casted.operator !== undefined &&
        casted.condition1 !== undefined &&
        casted.condition2 !== undefined);
}
export function isCombinedWhereModel(filter) {
    const casted = filter;
    return (casted &&
        casted.operator !== undefined &&
        casted.filter_1 !== undefined &&
        casted.filter_2 !== undefined);
}
export function isMulticolumnJoinOptions(filter) {
    return (filter &&
        filter.multiColumnJoinOperator !== undefined);
}
export function isFindOperator(filter) {
    const casted = filter;
    return (casted &&
        casted.type !== undefined &&
        (casted.value !== undefined ||
            casted.child !== undefined ||
            casted.type.toLowerCase() === GeneralFilters.ISNULL.toLowerCase()));
}
export function isOperator(val) {
    return Object.values(Operators).includes(typeof val === 'string' ? val.toUpperCase() : val);
}
//# sourceMappingURL=ag-grid-type-checker.utils.js.map