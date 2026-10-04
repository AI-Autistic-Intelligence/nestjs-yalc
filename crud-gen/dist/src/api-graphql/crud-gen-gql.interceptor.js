import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
export function crudGenGqlInterceptorWorker(startRow, endRow) {
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
        const gqlCtx = GqlExecutionContext.create(context);
        const { startRow, endRow } = gqlCtx?.getArgs?.() ?? {};
        return next
            .handle()
            .pipe(map(crudGenGqlInterceptorWorker(startRow, endRow)));
    }
};
CrudGenGqlInterceptor = __decorate([
    Injectable()
], CrudGenGqlInterceptor);
export { CrudGenGqlInterceptor };
//# sourceMappingURL=crud-gen-gql.interceptor.js.map