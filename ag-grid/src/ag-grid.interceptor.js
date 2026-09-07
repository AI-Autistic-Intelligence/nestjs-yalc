"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridInterceptor = void 0;
exports.agGridInterceptorWorker = agGridInterceptorWorker;
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
exports.AgGridInterceptor = AgGridInterceptor = __decorate([
    (0, common_1.Injectable)()
], AgGridInterceptor);
//# sourceMappingURL=ag-grid.interceptor.js.map