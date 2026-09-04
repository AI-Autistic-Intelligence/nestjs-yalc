import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { removeSymbolicSelection } from './ag-grid-args.decorator';
import { formatRawSelection } from "@nestjs-yalc/ag-grid/ag-grid-query.helper";
import { columnConversion, objectToFieldMapper } from "@nestjs-yalc/ag-grid/ag-grid-metadata.helper";
export const GqlAgGridFieldsMapper = (data, info) => {
    const fieldMapper = objectToFieldMapper(data);
    let keys = [];
    const keysMeta = {};
    const processSubItems = (mapper, item, prefix = '', path = '') => {
        if (path && !path.endsWith('.'))
            path += '.';
        if (item.name.value === 'pageData' && item.selectionSet)
            return;
        if (item.selectionSet) {
            item.selectionSet.selections.forEach((subItem) => {
                if (subItem.selectionSet) {
                    const extraInfo = mapper.extraInfo?.[subItem.name.value];
                    if (extraInfo) {
                        const nestedMapper = objectToFieldMapper(extraInfo);
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
                                    rawSelect: formatRawSelection(v.dst, k, subItem.name.value),
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
                const dst = columnConversion(subItem.name.value, mapper.field).toString();
                const _path = !path ? path + item.name.value + '.' : path;
                const key = _path + dst;
                keysMeta[key] = {
                    fieldMapper: mapper.field[subItem.name.value],
                    isNested: true,
                    rawSelect: formatRawSelection(dst, subItem.name.value, _prefix),
                };
                return;
            });
            return;
        }
        const dst = columnConversion(item.name.value, mapper.field).toString();
        const key = path + dst;
        const isNested = !!path;
        if (isNested || mapper.field[item.name.value]?.mode === 'derived') {
            keysMeta[key] = {
                fieldMapper: mapper.field[item.name.value],
                isNested,
                rawSelect: formatRawSelection(dst, item.name.value, prefix),
            };
            return;
        }
        keys.push(key);
    };
    info.fieldNodes?.[0].selectionSet?.selections.forEach((item) => processSubItems(fieldMapper, item));
    Object.keys(fieldMapper.field).forEach((k) => {
        const v = fieldMapper.field[k];
        if (v.isRequired) {
            if (v.mode === 'derived') {
                if (keysMeta[v.dst])
                    return;
                keysMeta[v.dst] = {
                    fieldMapper: v,
                    isNested: false,
                    rawSelect: formatRawSelection(v.dst, k, ''),
                };
                return;
            }
            keys.indexOf(v.dst) < 0 && keys.push(v.dst);
        }
    });
    keys = removeSymbolicSelection(keys, fieldMapper.field, '');
    return { keys, keysMeta };
};
export const GqlInfoGenerator = (data = {}, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const info = gqlCtx.getInfo();
    return GqlAgGridFieldsMapper(data, info).keys;
};
export const GqlFieldsMap = createParamDecorator(GqlInfoGenerator);
//# sourceMappingURL=gqlfields.decorator.js.map