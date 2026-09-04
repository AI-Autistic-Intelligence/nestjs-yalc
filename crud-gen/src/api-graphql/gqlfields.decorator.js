"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlFieldsMap = exports.GqlInfoGenerator = exports.GqlModelFieldsMapper = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const crud_gen_helpers_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers.js");
const crud_gen_args_helpers_js_1 = require("../typeorm/crud-gen-args.helpers.js");
const GqlModelFieldsMapper = (data, info) => {
    var _a, _b;
    const fieldMapper = (0, crud_gen_helpers_js_1.objectToFieldMapper)(data);
    let keys = [];
    const keysMeta = {};
    const processSubItems = (mapper, item, prefix = '', path = '') => {
        var _a, _b;
        if (path && !path.endsWith('.'))
            path += '.';
        if (item.name.value === 'pageData' && item.selectionSet)
            return;
        if (item.selectionSet) {
            const relationField = mapper.field[item.name.value];
            const sourceKey = (_a = relationField === null || relationField === void 0 ? void 0 : relationField.relation) === null || _a === void 0 ? void 0 : _a.sourceKey;
            if (sourceKey) {
                const normalizedPath = path ? path : '';
                const relationKey = `${normalizedPath}${sourceKey.dst}`;
                if (!normalizedPath) {
                    if (!keys.includes(relationKey)) {
                        keys.push(relationKey);
                    }
                }
                else if (!keys.includes(relationKey) && !keysMeta[relationKey]) {
                    keysMeta[relationKey] = {
                        fieldMapper: relationField,
                        isNested: true,
                        rawSelect: (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)(sourceKey.dst, normalizedPath.endsWith('.')
                            ? normalizedPath.slice(0, -1)
                            : normalizedPath),
                    };
                }
            }
            item.selectionSet.selections.forEach((subItem) => {
                var _a;
                if (subItem.selectionSet) {
                    const extraInfo = (_a = mapper.extraInfo) === null || _a === void 0 ? void 0 : _a[subItem.name.value];
                    if (extraInfo) {
                        const nestedMapper = (0, crud_gen_helpers_js_1.objectToFieldMapper)(extraInfo);
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
                                    rawSelect: (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)(v.dst, subItem.name.value),
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
                const dst = (0, crud_gen_helpers_js_1.columnConversion)(subItem.name.value, mapper.field).toString();
                const _path = !path ? path + item.name.value + '.' : path;
                const key = _path + dst;
                keysMeta[key] = {
                    fieldMapper: mapper.field[subItem.name.value],
                    isNested: true,
                    rawSelect: (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)(dst, _prefix),
                };
                return;
            });
            return;
        }
        const dst = (0, crud_gen_helpers_js_1.columnConversion)(item.name.value, mapper.field).toString();
        const key = path + dst;
        const isNested = !!path;
        if (isNested || ((_b = mapper.field[item.name.value]) === null || _b === void 0 ? void 0 : _b.mode) === 'derived') {
            keysMeta[key] = {
                fieldMapper: mapper.field[item.name.value],
                isNested,
                rawSelect: (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)(dst, prefix),
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
                    rawSelect: (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)(v.dst, ''),
                };
                return;
            }
            keys.indexOf(v.dst) < 0 && keys.push(v.dst);
        }
    });
    keys = (0, crud_gen_args_helpers_js_1.removeSymbolicSelection)(keys, fieldMapper.field, '');
    return { keys, keysMeta };
};
exports.GqlModelFieldsMapper = GqlModelFieldsMapper;
const GqlInfoGenerator = (data = {}, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const info = gqlCtx.getInfo();
    return (0, exports.GqlModelFieldsMapper)(data, info).keys;
};
exports.GqlInfoGenerator = GqlInfoGenerator;
exports.GqlFieldsMap = (0, common_1.createParamDecorator)(exports.GqlInfoGenerator);
//# sourceMappingURL=gqlfields.decorator.js.map