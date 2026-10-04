"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridInterceptor = void 0;
exports.agGridInterceptorWorker = agGridInterceptorWorker;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const graphql_1 = require("@nestjs/graphql");
function agGridInterceptorWorker(startRow, endRow) {
    return ([page, count]) => {
        return {
            nodes: page,
            pageData: { count, startRow: startRow ?? 0, endRow: endRow ?? count },
        };
    };
}
let AgGridInterceptor = class AgGridInterceptor {
    intercept(context, next) {
        const gqlCtx = graphql_1.GqlExecutionContext.create(context);
        const { startRow, endRow } = gqlCtx.getArgs();
        return next.handle().pipe((0, operators_1.map)(agGridInterceptorWorker(startRow, endRow)));
    }
};
exports.AgGridInterceptor = AgGridInterceptor;
exports.AgGridInterceptor = AgGridInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AgGridInterceptor);
//# sourceMappingURL=ag-grid.interceptor.js.map