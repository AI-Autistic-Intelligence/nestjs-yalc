"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudGenGqlInterceptor = void 0;
exports.crudGenGqlInterceptorWorker = crudGenGqlInterceptorWorker;
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
exports.CrudGenGqlInterceptor = CrudGenGqlInterceptor = __decorate([
    (0, common_1.Injectable)()
], CrudGenGqlInterceptor);
//# sourceMappingURL=crud-gen-gql.interceptor.js.map