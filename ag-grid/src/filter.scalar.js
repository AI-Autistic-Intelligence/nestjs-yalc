"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterScalar = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const ag_grid_type_checker_utils_1 = require("./ag-grid-type-checker.utils");
const ag_grid_enum_1 = require("./ag-grid.enum");
const ag_grid_error_1 = require("./ag-grid.error");
let FilterScalar = class FilterScalar {
    constructor() {
        this.description = 'AG-Grid Filter scalar type';
        this.resultMemoize = new Map();
        this.resultMemoizeInverse = new WeakMap();
    }
    parseValue(value) {
        const cached = this.resultMemoize.get(value);
        if (cached)
            return cached;
        const parsedValue = JSON.parse(value);
        const normalizeInput = (input) => {
            const _normalizedInput = {
                expressions: [],
            };
            Object.keys(input).forEach((key) => {
                const field = input[key];
                if (key === ag_grid_enum_1.CustomWhereKeys.MULTICOLUMNJOINOPTIONS &&
                    (0, ag_grid_type_checker_utils_1.isMulticolumnJoinOptions)(field)) {
                    _normalizedInput.childExpressions = [
                        Object.assign(Object.assign({}, normalizeInput(field)), { operator: field.multiColumnJoinOperator }),
                    ];
                    return;
                }
                if (_normalizedInput.expressions &&
                    ((0, ag_grid_type_checker_utils_1.isFilterModel)(field) || (0, ag_grid_type_checker_utils_1.isCombinedFilterModel)(field))) {
                    _normalizedInput.expressions.push({
                        [field.filterType]: Object.assign(Object.assign({}, field), { field: key, filterType: field.filterType }),
                    });
                }
            });
            return _normalizedInput;
        };
        const filter = normalizeInput(parsedValue);
        this.resultMemoize.set(value, filter);
        this.resultMemoizeInverse.set(filter, value);
        return filter;
    }
    serialize(value) {
        return typeof value === 'string'
            ? value
            : this.resultMemoizeInverse.get(value);
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.parseValue(ast.value);
        }
        throw new ag_grid_error_1.AgGridBadFilterTypeError();
    }
};
exports.FilterScalar = FilterScalar;
exports.FilterScalar = FilterScalar = __decorate([
    (0, graphql_1.Scalar)('FilterInput')
], FilterScalar);
//# sourceMappingURL=filter.scalar.js.map