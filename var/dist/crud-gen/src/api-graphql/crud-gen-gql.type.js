"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = exports.PageDataCrudGenGql = void 0;
exports.default = CrudGenGqlType;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const returnValue_1 = tslib_1.__importDefault(require("@node-yalc/utils/returnValue"));
let PageDataCrudGenGql = class PageDataCrudGenGql {
};
exports.PageDataCrudGenGql = PageDataCrudGenGql;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "count", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "startRow", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "endRow", void 0);
exports.PageDataCrudGenGql = PageDataCrudGenGql = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], PageDataCrudGenGql);
exports.typeMap = {};
function CrudGenGqlType(type) {
    const { name } = type;
    if (exports.typeMap[`${name}`])
        return exports.typeMap[`${name}`];
    let Connection = class Connection {
        constructor() {
            this.name = `${name}Connection`;
        }
    };
    tslib_1.__decorate([
        (0, graphql_1.HideField)(),
        tslib_1.__metadata("design:type", Object)
    ], Connection.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)([type]), { nullable: true }),
        tslib_1.__metadata("design:type", Array)
    ], Connection.prototype, "nodes", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(PageDataCrudGenGql), { nullable: true }),
        tslib_1.__metadata("design:type", PageDataCrudGenGql)
    ], Connection.prototype, "pageData", void 0);
    Connection = tslib_1.__decorate([
        (0, graphql_1.ObjectType)(`${name}Connection`, { isAbstract: true })
    ], Connection);
    exports.typeMap[`${name}`] = Connection;
    return exports.typeMap[`${name}`];
}
//# sourceMappingURL=crud-gen-gql.type.js.map