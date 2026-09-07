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
const crud_gen_type_checker_utils_js_1 = require("./crud-gen-type-checker.utils.js");
const crud_gen_enum_js_1 = require("./crud-gen.enum.js");
const crud_gen_error_js_1 = require("./crud-gen.error.js");
let FilterScalar = class FilterScalar {
    constructor() {
        this.description = 'CrudGen Filter scalar type';
        this.resultMemoize = new Map();
        this.resultMemoizeInverse = new WeakMap();
    }
    parseValue(value) {
        const cached = this.resultMemoize.get(value);
        if (cached)
            return cached;
        const parsedValue = JSON.parse(typeof value === 'string' ? value : '{}');
        const normalizeInput = (input) => {
            const _normalizedInput = {
                expressions: [],
            };
            Object.keys(input).forEach((key) => {
                const field = input[key];
                if (key === crud_gen_enum_js_1.CustomWhereKeys.MULTICOLUMNJOINOPTIONS &&
                    (0, crud_gen_type_checker_utils_js_1.isMulticolumnJoinOptions)(field)) {
                    _normalizedInput.childExpressions = [
                        {
                            ...normalizeInput(field),
                            operator: field.multiColumnJoinOperator,
                        },
                    ];
                    return;
                }
                if (_normalizedInput.expressions &&
                    ((0, crud_gen_type_checker_utils_js_1.isFilterModel)(field) || (0, crud_gen_type_checker_utils_js_1.isCombinedFilterModel)(field))) {
                    _normalizedInput.expressions.push({
                        [field.filterType]: {
                            ...field,
                            field: key,
                            filterType: field.filterType,
                        },
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
        if (typeof value === 'string')
            return value;
        if (typeof value !== 'object' || value === null) {
            return String(value ?? '');
        }
        const memoized = this.resultMemoizeInverse.get(value);
        if (typeof memoized === 'string') {
            return memoized;
        }
        throw new crud_gen_error_js_1.CrudGenBadFilterTypeError();
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.parseValue(ast.value);
        }
        throw new crud_gen_error_js_1.CrudGenBadFilterTypeError();
    }
};
exports.FilterScalar = FilterScalar;
exports.FilterScalar = FilterScalar = __decorate([
    (0, graphql_1.Scalar)('FilterInput')
], FilterScalar);
//# sourceMappingURL=filter.scalar.js.map