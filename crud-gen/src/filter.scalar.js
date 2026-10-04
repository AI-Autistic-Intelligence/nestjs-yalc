import { __decorate } from "tslib";
import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';
import { isCombinedFilterModel, isFilterModel, isMulticolumnJoinOptions, } from './crud-gen-type-checker.utils.js';
import { CustomWhereKeys } from './crud-gen.enum.js';
import { CrudGenBadFilterTypeError } from './crud-gen.error.js';
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
                if (key === CustomWhereKeys.MULTICOLUMNJOINOPTIONS &&
                    isMulticolumnJoinOptions(field)) {
                    _normalizedInput.childExpressions = [
                        {
                            ...normalizeInput(field),
                            operator: field.multiColumnJoinOperator,
                        },
                    ];
                    return;
                }
                if (_normalizedInput.expressions &&
                    (isFilterModel(field) || isCombinedFilterModel(field))) {
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
        throw new CrudGenBadFilterTypeError();
    }
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return this.parseValue(ast.value);
        }
        throw new CrudGenBadFilterTypeError();
    }
};
FilterScalar = __decorate([
    Scalar('FilterInput')
], FilterScalar);
export { FilterScalar };
//# sourceMappingURL=filter.scalar.js.map