"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = exports.PageDataAgGrid = void 0;
exports.default = AgGridGqlType;
const graphql_1 = require("@nestjs/graphql");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
let PageDataAgGrid = class PageDataAgGrid {
};
exports.PageDataAgGrid = PageDataAgGrid;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "count", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "startRow", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PageDataAgGrid.prototype, "endRow", void 0);
exports.PageDataAgGrid = PageDataAgGrid = __decorate([
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
    __decorate([
        (0, graphql_1.HideField)(),
        __metadata("design:type", Object)
    ], Connection.prototype, "name", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)([type]), { nullable: true }),
        __metadata("design:type", Array)
    ], Connection.prototype, "nodes", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(PageDataAgGrid), { nullable: true }),
        __metadata("design:type", PageDataAgGrid)
    ], Connection.prototype, "pageData", void 0);
    Connection = __decorate([
        (0, graphql_1.ObjectType)(`${name}Connection`, { isAbstract: true })
    ], Connection);
    exports.typeMap[`${name}`] = Connection;
    return exports.typeMap[`${name}`];
}
//# sourceMappingURL=ag-grid.type.js.map