"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = exports.PageDataAgGrid = void 0;
exports.default = AgGridGqlType;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const returnValue_1 = tslib_1.__importDefault(require("@node-yalc/utils/returnValue"));
let PageDataAgGrid = class PageDataAgGrid {
};
exports.PageDataAgGrid = PageDataAgGrid;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataAgGrid.prototype, "count", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataAgGrid.prototype, "startRow", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", Number)
], PageDataAgGrid.prototype, "endRow", void 0);
exports.PageDataAgGrid = PageDataAgGrid = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], PageDataAgGrid);
exports.typeMap = {};
function AgGridGqlType(type) {
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
        (0, graphql_1.Field)((0, returnValue_1.default)(PageDataAgGrid), { nullable: true }),
        tslib_1.__metadata("design:type", PageDataAgGrid)
    ], Connection.prototype, "pageData", void 0);
    Connection = tslib_1.__decorate([
        (0, graphql_1.ObjectType)(`${name}Connection`, { isAbstract: true })
    ], Connection);
    exports.typeMap[`${name}`] = Connection;
    return exports.typeMap[`${name}`];
}
//# sourceMappingURL=ag-grid.type.js.map