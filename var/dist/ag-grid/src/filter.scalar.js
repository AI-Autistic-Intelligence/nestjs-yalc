import { __decorate } from "tslib";
import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';
import { isCombinedFilterModel, isFilterModel, isMulticolumnJoinOptions, } from './ag-grid-type-checker.utils';
import { CustomWhereKeys } from './ag-grid.enum';
import { AgGridBadFilterTypeError } from './ag-grid.error';
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
        return typeof value === 'string'
            ? value
            : this.resultMemoizeInverse.get(value);
    }
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return this.parseValue(ast.value);
        }
        throw new AgGridBadFilterTypeError();
    }
};
FilterScalar = __decorate([
    Scalar('FilterInput')
], FilterScalar);
export { FilterScalar };
//# sourceMappingURL=filter.scalar.js.map