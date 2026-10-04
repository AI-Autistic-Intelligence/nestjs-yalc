"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowDefaultValues = exports.ExtraArgsStrategy = exports.CustomWhereKeys = exports.SortDirection = exports.Operators = exports.FilterType = exports.GeneralFilters = void 0;
exports.entityFieldsEnumFactory = entityFieldsEnumFactory;
const class_helper_js_1 = require("@node-yalc/utils/class.helper.js");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_metadata_helper_js_1 = require("./ag-grid-metadata.helper.js");
const ag_grid_enum_js_1 = require("@node-yalc/datagrid/ag-grid.enum.js");
Object.defineProperty(exports, "GeneralFilters", { enumerable: true, get: function () { return ag_grid_enum_js_1.GeneralFilters; } });
Object.defineProperty(exports, "FilterType", { enumerable: true, get: function () { return ag_grid_enum_js_1.FilterType; } });
Object.defineProperty(exports, "Operators", { enumerable: true, get: function () { return ag_grid_enum_js_1.Operators; } });
Object.defineProperty(exports, "SortDirection", { enumerable: true, get: function () { return ag_grid_enum_js_1.SortDirection; } });
Object.defineProperty(exports, "CustomWhereKeys", { enumerable: true, get: function () { return ag_grid_enum_js_1.CustomWhereKeys; } });
Object.defineProperty(exports, "ExtraArgsStrategy", { enumerable: true, get: function () { return ag_grid_enum_js_1.ExtraArgsStrategy; } });
Object.defineProperty(exports, "RowDefaultValues", { enumerable: true, get: function () { return ag_grid_enum_js_1.RowDefaultValues; } });
(0, graphql_1.registerEnumType)(ag_grid_enum_js_1.GeneralFilters, {
    name: 'GeneralFiltersEnum',
});
(0, graphql_1.registerEnumType)(ag_grid_enum_js_1.FilterType, {
    name: 'FilterTypeEnum',
});
(0, graphql_1.registerEnumType)(ag_grid_enum_js_1.Operators, {
    name: 'FilterOperatorsEnum',
});
(0, graphql_1.registerEnumType)(ag_grid_enum_js_1.SortDirection, {
    name: 'SortDirection',
});
const fieldsEnumCache = new WeakMap();
function entityFieldsEnumFactory(entityModel) {
    let cached;
    const prototype = !(0, class_helper_js_1.isClass)(entityModel) ? entityModel.prototype : entityModel;
    if ((cached = fieldsEnumCache.get(prototype)))
        return cached;
    const properties = {};
    (0, ag_grid_metadata_helper_js_1.getMappedTypeProperties)(prototype).map((v) => (properties[v] = v));
    const FieldsEnum = { ...properties };
    (0, graphql_1.registerEnumType)(FieldsEnum, {
        name: `${prototype.name}FieldEnum`,
    });
    fieldsEnumCache.set(prototype, FieldsEnum);
    return FieldsEnum;
}
//# sourceMappingURL=ag-grid.enum.js.map