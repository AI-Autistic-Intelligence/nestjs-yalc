export * from '@node-yalc/datagrid/ag-grid.enum.js';
import { isClass } from '@node-yalc/utils/class.helper.js';
import { getMappedTypeProperties } from './crud-gen.helpers.js';
const fieldsEnumCache = new WeakMap();
export function entityFieldsEnumFactory(entityModel) {
    let cached;
    const prototype = !isClass(entityModel) ? entityModel.prototype : entityModel;
    if ((cached = fieldsEnumCache.get(prototype)))
        return {
            enum: cached,
            cached: true,
            prototype,
        };
    const properties = {};
    getMappedTypeProperties(prototype).map((v) => (properties[v] = v));
    const FieldsEnum = { ...properties };
    fieldsEnumCache.set(prototype, FieldsEnum);
    return { enum: FieldsEnum, cached: false, prototype };
}
//# sourceMappingURL=crud-gen.enum.js.map