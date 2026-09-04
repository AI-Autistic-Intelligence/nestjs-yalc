import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
export function agGridInterceptorWorker(startRow, endRow) {
    return ([page, count]) => {
        return {
            nodes: page,
            pageData: { count, startRow: startRow ?? 0, endRow: endRow ?? count },
        };
    };
}
let AgGridInterceptor = class AgGridInterceptor {
    intercept(context, next) {
        const gqlCtx = GqlExecutionContext.create(context);
        const { startRow, endRow } = gqlCtx.getArgs();
        return next.handle().pipe(map(agGridInterceptorWorker(startRow, endRow)));
    }
};
AgGridInterceptor = __decorate([
    Injectable()
], AgGridInterceptor);
export { AgGridInterceptor };
//# sourceMappingURL=ag-grid.interceptor.js.map