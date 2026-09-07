import { AnyFunction, ClassType } from '@nest-yalc-2/types';
export declare enum GeneralFilters {
    NOT = "not",
    CONTAINS = "contains",
    NOTCONTAINS = "notContains",
    EQUALS = "equals",
    EQUAL = "equal",
    NOTEQUAL = "notEqual",
    LIKE = "like",
    NOTLIKE = "notLike",
    BETWEEN = "between",
    NOTBETWEEN = "notBetween",
    IN = "in",
    NOTIN = "notIn",
    STARTSWITH = "startsWith",
    NOTSTARTSWITH = "notStartsWith",
    ENDSWITH = "endsWith",
    NOTENDSWITH = "notEndsWith",
    LESSTHAN = "lessThan",
    NOTLESSTHAN = "notLessThan",
    LESSTHANOREQUAL = "lessThanOrEqual",
    NOTLESSTHANOREQUAL = "notLessThanOrEqual",
    GREATERTHAN = "greaterThan",
    NOTGREATERTHAN = "notGreaterThan",
    GREATERTHANOREQUAL = "greaterThanOrEqual",
    NOTGREATERTHANOREQUAL = "notGreaterThanOrEqual",
    INRANGE = "inRange",
    INDATE = "inDate",
    ISNULL = "isNull",
    NOTISNULL = "notIsNull",
    VIRTUAL = "virtual"
}
export declare enum FilterType {
    TEXT = "text",
    MULTI = "multi",
    NUMBER = "number",
    DATE = "date",
    SET = "set"
}
export declare enum Operators {
    AND = "AND",
    OR = "OR"
}
export declare enum SortDirection {
    DESC = "DESC",
    ASC = "ASC"
}
export declare enum CustomWhereKeys {
    MULTICOLUMNJOINOPTIONS = "multiColumnJoinOptions",
    MULTICOLUMNJOINOPERATOR = "multiColumnJoinOperator",
    OPERATOR = "operator"
}
export declare enum ExtraArgsStrategy {
    DEFAULT = 0,
    AT_LEAST_ONE = 1,
    ONLY_ONE = 2
}
export declare enum RowDefaultValues {
    END_ROW = 100,
    START_ROW = 0,
    MAX_ROW = 200
}
export declare function entityFieldsEnumFactory<Entity>(entityModel: ClassType<Entity> | AnyFunction): {
    [index: string]: string;
};
