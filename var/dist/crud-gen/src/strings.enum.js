export var FilterErrors;
(function (FilterErrors) {
    FilterErrors["FILTER_NOT_SUPPORTED"] = "This filter is not supported";
    FilterErrors["BAD_FILTER_TYPE"] = "The 'filters' field must be a string";
    FilterErrors["INVALID_ARGUMENT"] = "Invalid argument";
    FilterErrors["INVALID_OPERATOR"] = "Invalid operator";
    FilterErrors["INVALID_CONDITION"] = "Invalid condition";
    FilterErrors["NOT_POSSIBLE_EXCEPTION"] = "Cannot execute without filters";
    FilterErrors["STRING_WHERE"] = "\"where\" property cannot be a string";
    FilterErrors["INVALID_PROPERTY"] = "Invalid property";
    FilterErrors["FILTER_PROHIBITED"] = "Cannot filter on property you cannot request";
    FilterErrors["BAD_FILTER"] = "This is not a valid filter";
})(FilterErrors || (FilterErrors = {}));
export var CrudGenErrors;
(function (CrudGenErrors) {
    CrudGenErrors["REQUIRED_ARGS"] = "You should provide at least one of the arguments";
})(CrudGenErrors || (CrudGenErrors = {}));
//# sourceMappingURL=strings.enum.js.map