"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityFieldsEnumGqlFactory = entityFieldsEnumGqlFactory;
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const graphql_1 = require("@nestjs/graphql");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
(0, graphql_1.registerEnumType)(crud_gen_enum_js_1.GeneralFilters, {
    name: 'GeneralFiltersEnum',
});
(0, graphql_1.registerEnumType)(crud_gen_enum_js_1.FilterType, {
    name: 'FilterTypeEnum',
});
(0, graphql_1.registerEnumType)(crud_gen_enum_js_1.Operators, {
    name: 'FilterOperatorsEnum',
});
(0, graphql_1.registerEnumType)(crud_gen_enum_js_1.SortDirection, {
    name: 'SortDirection',
});
const fieldsEnumGraphqlRegistrationCache = new WeakMap();
function entityFieldsEnumGqlFactory(entityModel) {
    const prototype = !(0, class_helper_js_1.isClass)(entityModel) ? entityModel.prototype : entityModel;
    const res = (0, crud_gen_enum_js_1.entityFieldsEnumFactory)(entityModel);
    if (!fieldsEnumGraphqlRegistrationCache.get(prototype)) {
        (0, graphql_1.registerEnumType)(res.enum, {
            name: `${res.prototype.name}FieldEnum`,
        });
        fieldsEnumGraphqlRegistrationCache.set(prototype, true);
    }
    return res.enum;
}
//# sourceMappingURL=crud-gen-gql.enum.js.map