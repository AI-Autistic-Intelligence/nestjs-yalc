"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlFieldsMap = exports.GqlInfoGenerator = exports.GqlAgGridFieldsMapper = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const ag_grid_query_helper_1 = require("@nestjs-yalc/ag-grid/ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("@nestjs-yalc/ag-grid/ag-grid-metadata.helper");
const GqlAgGridFieldsMapper = (data, info) => {
    var _a, _b;
    const fieldMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(data);
    let keys = [];
    const keysMeta = {};
    const processSubItems = (mapper, item, prefix = '', path = '') => {
        var _a;
        if (path && !path.endsWith('.'))
            path += '.';
        if (item.name.value === 'pageData' && item.selectionSet)
            return;
        if (item.selectionSet) {
            item.selectionSet.selections.forEach((subItem) => {
                var _a;
                if (subItem.selectionSet) {
                    const extraInfo = (_a = mapper.extraInfo) === null || _a === void 0 ? void 0 : _a[subItem.name.value];
                    if (extraInfo) {
                        const nestedMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(extraInfo);
                        if (item.name.value === 'nodes') {
                            processSubItems(nestedMapper, subItem, prefix, path);
                            return;
                        }
                        const _path = path + subItem.name.value;
                        processSubItems(nestedMapper, subItem, subItem.name.value, _path);
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
                const _prefix = item.name.value;
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
        if (isNested || ((_a = mapper.field[item.name.value]) === null || _a === void 0 ? void 0 : _a.mode) === 'derived') {
            keysMeta[key] = {
                fieldMapper: mapper.field[item.name.value],
                isNested,
                rawSelect: (0, ag_grid_query_helper_1.formatRawSelection)(dst, item.name.value, prefix),
            };
            return;
        }
        keys.push(key);
    };
    (_b = (_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a[0].selectionSet) === null || _b === void 0 ? void 0 : _b.selections.forEach((item) => processSubItems(fieldMapper, item));
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