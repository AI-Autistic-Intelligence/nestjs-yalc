export * from '@node-yalc/datagrid/ag-grid.enum.js';
import { AnyFunction, ClassType } from '@node-yalc/types/globals.js';
import { isClass } from '@node-yalc/utils/class.helper.js';
import { getMappedTypeProperties } from './crud-gen.helpers.js';















const fieldsEnumCache = new WeakMap();
export function entityFieldsEnumFactory<Entity>(
  entityModel: ClassType<Entity> | AnyFunction,
): { enum: { [index: string]: string }; cached: boolean; prototype: any } {
  let cached;
  const prototype = !isClass(entityModel) ? entityModel.prototype : entityModel;
  if ((cached = fieldsEnumCache.get(prototype)))
    return {
      enum: cached,
      cached: true,
      prototype,
    };

  const properties: { [x in string | number]: any } = {};

  getMappedTypeProperties(prototype).map((v) => (properties[v] = v));

  type FieldsEnumType = keyof typeof properties;
  const FieldsEnum: { [P in FieldsEnumType]: P } = { ...properties };

  fieldsEnumCache.set(prototype, FieldsEnum);

  return { enum: FieldsEnum, cached: false, prototype };
}
