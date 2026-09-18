"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudGenGqlInterceptor = void 0;
exports.crudGenGqlInterceptorWorker = crudGenGqlInterceptorWorker;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const graphql_1 = require("@nestjs/graphql");
function crudGenGqlInterceptorWorker(startRow, endRow) {
    return (value) => {
        if (!Array.isArray(value) ||
            value.length !== 2 ||
            typeof value[1] !== 'number') {
            return value;
        }
        const [page, count] = value;
        return {
            nodes: page,
            pageData: { count, startRow: startRow ?? 0, endRow: endRow ?? count },
        };
    };
}
let CrudGenGqlInterceptor = class CrudGenGqlInterceptor {
    intercept(context, next) {
        const gqlCtx = graphql_1.GqlExecutionContext.create(context);
        const { startRow, endRow } = gqlCtx?.getArgs?.() ?? {};
        return next
            .handle()
            .pipe((0, operators_1.map)(crudGenGqlInterceptorWorker(startRow, endRow)));
    }
};
exports.CrudGenGqlInterceptor = CrudGenGqlInterceptor;
exports.CrudGenGqlInterceptor = CrudGenGqlInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CrudGenGqlInterceptor);
//# sourceMappingURL=crud-gen-gql.interceptor.js.map