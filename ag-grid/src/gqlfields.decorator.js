"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlFieldsMap = exports.GqlInfoGenerator = exports.GqlAgGridFieldsMapper = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const ag_grid_query_helper_1 = require("@nest-yalc-2/ag-grid/ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("@nest-yalc-2/ag-grid/ag-grid-metadata.helper");
const GqlAgGridFieldsMapper = (data, info) => {
    const fieldMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(data);
    /**
     * Selections
     */
    let keys = [];
    /**
     * Custom or Derived keys
     */
    const keysMeta = {};
    const processSubItems = (mapper, item, prefix = '', path = '') => {
        if (path && !path.endsWith('.'))
            path += '.';
        /**
         * Do not process fields that are not actual fields (pageData etc)
         * @todo improve this logic by using metadata on these properties instead of the hardcoded name
         */
        if (item.name.value === 'pageData' && item.selectionSet)
            return;
        if (item.selectionSet) {
            item.selectionSet.selections.forEach((subItem) => {
                /**
                 * if it's a nested item, then recurse
                 */
                if (subItem.selectionSet) {
                    const extraInfo = mapper.extraInfo?.[subItem.name.value];
                    if (extraInfo) {
                        const nestedMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(extraInfo);
                        if (item.name.value === 'nodes') {
                            processSubItems(nestedMapper, subItem, prefix, path);
                            return;
                        }
                        const _path = path + subItem.name.value;
                        processSubItems(nestedMapper, subItem, subItem.name.value, _path);
                        // add required fields that have not been selected by the client
                        Object.keys(nestedMapper.field).forEach((k) => {
                            const v = nestedMapper.field[k];
                            const key = _path + '.' + v.dst;
                            if (v.isRequired && !keysMeta[key]) {
                                keysMeta[key] = {
                                    fieldMapper: v,
                                    isNested: true,
                                    rawSelect: (0, ag_grid_query_helper_1.formatRawSelection)(v.dst, k, subItem.name.value),
                                };
                            }
                        });
                    }
                    return;
                }
                if (item.name.value === 'nodes') {
                    processSubItems(mapper, subItem, prefix, path);
                    return;
                }
                // We have to set a prefix when the parent is a nested item different by "nodes"
                const _prefix = item.name.value;
                // const _path =
                //   item.name.value !== 'nodes' ? path + item.name.value + '.' : path;
                const dst = (0, ag_grid_metadata_helper_1.columnConversion)(subItem.name.value, mapper.field).toString();
                const _path = !path ? path + item.name.value + '.' : path;
                const key = _path + dst;
                keysMeta[key] = {
                    fieldMapper: mapper.field[subItem.name.value],
                    isNested: true,
                    rawSelect: (0, ag_grid_query_helper_1.formatRawSelection)(dst, subItem.name.value, _prefix),
                };
                return;
            });
            return;
        }
        const dst = (0, ag_grid_metadata_helper_1.columnConversion)(item.name.value, mapper.field).toString();
        const key = path + dst;
        const isNested = !!path;
        /**
         * If the field is derived we want to add it to the selection
         */
        if (isNested || mapper.field[item.name.value]?.mode === 'derived') {
            keysMeta[key] = {
                fieldMapper: mapper.field[item.name.value],
                isNested,
                rawSelect: (0, ag_grid_query_helper_1.formatRawSelection)(dst, item.name.value, prefix),
            };
            return;
        }
        keys.push(key);
    };
    /**
     * START Process first level fields
     */
    /**
     * Process selected fields
     */
    info.fieldNodes?.[0]?.selectionSet?.selections?.forEach((item) => processSubItems(fieldMapper, item));
    /**
     * Process required fields
     */
    // add required fields that have not been selected by the client
    Object.keys(fieldMapper.field).forEach((k) => {
        const v = fieldMapper.field[k];
        if (v.isRequired) {
            if (v.mode === 'derived') {
                if (keysMeta[v.dst])
                    return;
                keysMeta[v.dst] = {
                    fieldMapper: v,
                    isNested: false,
                    rawSelect: (0, ag_grid_query_helper_1.formatRawSelection)(v.dst, k, ''),
                };
                return;
            }
            keys.indexOf(v.dst) < 0 && keys.push(v.dst);
        }
    });
    /**
     * Remove symbolic fields that can't be used for the database
     */
    keys = (0, ag_grid_args_decorator_1.removeSymbolicSelection)(keys, fieldMapper.field, '');
    return { keys, keysMeta };
};
exports.GqlAgGridFieldsMapper = GqlAgGridFieldsMapper;
const GqlInfoGenerator = (data = {}, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const info = gqlCtx.getInfo();
    return (0, exports.GqlAgGridFieldsMapper)(data, info).keys;
};
exports.GqlInfoGenerator = GqlInfoGenerator;
exports.GqlFieldsMap = (0, common_1.createParamDecorator)(exports.GqlInfoGenerator);
//# sourceMappingURL=gqlfields.decorator.js.map