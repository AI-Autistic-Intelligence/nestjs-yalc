import { __decorate, __metadata } from "tslib";
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import returnValue from '@nestjs-yalc/utils/returnValue.js';
let PageDataCrudGenGql = class PageDataCrudGenGql {
};
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "count", void 0);
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "startRow", void 0);
__decorate([
    Field(),
    __metadata("design:type", Number)
], PageDataCrudGenGql.prototype, "endRow", void 0);
PageDataCrudGenGql = __decorate([
    ObjectType()
], PageDataCrudGenGql);
export { PageDataCrudGenGql };
export const typeMap = {};
export default function CrudGenGqlType(type) {
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
        Field(returnValue(PageDataCrudGenGql), { nullable: true }),
        __metadata("design:type", PageDataCrudGenGql)
    ], Connection.prototype, "pageData", void 0);
    Connection = __decorate([
        ObjectType(`${name}Connection`, { isAbstract: true })
    ], Connection);
    typeMap[`${name}`] = Connection;
    return typeMap[`${name}`];
}
//# sourceMappingURL=crud-gen-gql.type.js.map