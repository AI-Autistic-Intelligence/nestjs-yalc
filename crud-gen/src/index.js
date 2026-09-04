"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDTOMixin = exports.CGRestQueryArgs = exports.PaginatedResultDto = exports.PageData = exports.crudGenRestParamsNoPaginationFactory = exports.crudGenRestParamsFactory = exports.CGQueryDto = exports.ApiOkResponsePaginated = exports.CGQueryArgsNoPagination = exports.CGQueryArgs = exports.CrudGenArgsMapper = exports.CrudGenCombineDecorators = void 0;
__exportStar(require("./crud-gen.helpers.js"), exports);
__exportStar(require("./crud-gen-resource.factory.js"), exports);
__exportStar(require("./crud-gen.enum.js"), exports);
__exportStar(require("./crud-gen.interface.js"), exports);
__exportStar(require("./crud-gen.error.js"), exports);
__exportStar(require("./conditions.error.js"), exports);
__exportStar(require("./entity.error.js"), exports);
__exportStar(require("./missing-arguments.error.js"), exports);
__exportStar(require("./object.decorator.js"), exports);
__exportStar(require("./transformers.helpers.js"), exports);
__exportStar(require("./api-graphql/crud-gen-gql.interface.js"), exports);
__exportStar(require("./api-graphql/crud-gen-gql.type.js"), exports);
__exportStar(require("./api-graphql/generic.resolver.js"), exports);
var crud_gen_args_rest_decorator_js_1 = require("./api-rest/crud-gen-args-rest.decorator.js");
Object.defineProperty(exports, "CrudGenCombineDecorators", { enumerable: true, get: function () { return crud_gen_args_rest_decorator_js_1.CrudGenCombineDecorators; } });
Object.defineProperty(exports, "CrudGenArgsMapper", { enumerable: true, get: function () { return crud_gen_args_rest_decorator_js_1.CrudGenArgsMapper; } });
Object.defineProperty(exports, "CGQueryArgs", { enumerable: true, get: function () { return crud_gen_args_rest_decorator_js_1.CGQueryArgs; } });
Object.defineProperty(exports, "CGQueryArgsNoPagination", { enumerable: true, get: function () { return crud_gen_args_rest_decorator_js_1.CGQueryArgsNoPagination; } });
Object.defineProperty(exports, "ApiOkResponsePaginated", { enumerable: true, get: function () { return crud_gen_args_rest_decorator_js_1.ApiOkResponsePaginated; } });
var crud_gen_rest_dto_js_1 = require("./api-rest/crud-gen-rest.dto.js");
Object.defineProperty(exports, "CGQueryDto", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.CGQueryDto; } });
Object.defineProperty(exports, "crudGenRestParamsFactory", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.crudGenRestParamsFactory; } });
Object.defineProperty(exports, "crudGenRestParamsNoPaginationFactory", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.crudGenRestParamsNoPaginationFactory; } });
Object.defineProperty(exports, "PageData", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.PageData; } });
Object.defineProperty(exports, "PaginatedResultDto", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.PaginatedResultDto; } });
Object.defineProperty(exports, "CGRestQueryArgs", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.CGRestQueryArgs; } });
Object.defineProperty(exports, "PaginationDTOMixin", { enumerable: true, get: function () { return crud_gen_rest_dto_js_1.PaginationDTOMixin; } });
__exportStar(require("./api-rest/crud-gen-rest.interceptor.js"), exports);
__exportStar(require("./api-rest/crud-gen-rest.controller.factory.js"), exports);
__exportStar(require("./api-rest/odata-query.interface.js"), exports);
__exportStar(require("./typeorm/generic.repository.js"), exports);
__exportStar(require("./typeorm/generic.service.js"), exports);
__exportStar(require("./projection/projection-resource.js"), exports);
__exportStar(require("./projection/projection-dialect.js"), exports);
__exportStar(require("./projection/projection-graphql.js"), exports);
__exportStar(require("./projection/projection.service.js"), exports);
__exportStar(require("./projection/projection-schema.js"), exports);
//# sourceMappingURL=index.js.map