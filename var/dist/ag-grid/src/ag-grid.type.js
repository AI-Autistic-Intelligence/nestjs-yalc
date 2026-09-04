import { __decorate, __metadata } from "tslib";
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import returnValue from '@nestjs-yalc/utils/returnValue';
let PageDataAgGrid = class PageDataAgGrid {
};
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "count", void 0);
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "startRow", void 0);
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "endRow", void 0);
PageDataAgGrid = __decorate([
    ObjectType()
], PageDataAgGrid);
export { PageDataAgGrid };
export const typeMap = {};
export default function AgGridGqlType(type) {
    const { name } = type;
    if (typeMap[`${name}`])
        return typeMap[`${name}`];
    let Connection = class Connection {
        constructor() {
            this.name = `${name}Connection`;
        }
    };
    __decorate([
        HideField(),
        __metadata("design:type", Object)
    ], Connection.prototype, "name", void 0);
    __decorate([
        Field(returnValue([type]), { nullable: true }),
        __metadata("design:type", Array)
    ], Connection.prototype, "nodes", void 0);
    __decorate([
        Field(returnValue(PageDataAgGrid), { nullable: true }),
        __metadata("design:type", PageDataAgGrid)
    ], Connection.prototype, "pageData", void 0);
    Connection = __decorate([
        ObjectType(`${name}Connection`, { isAbstract: true })
    ], Connection);
    typeMap[`${name}`] = Connection;
    return typeMap[`${name}`];
}
//# sourceMappingURL=ag-grid.type.js.map