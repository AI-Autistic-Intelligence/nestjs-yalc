import { AnyFunction, ClassType } from '@node-yalc/types/globals.js';
import { isClass } from '@node-yalc/utils/class.helper.js';
import { registerEnumType } from '@nestjs/graphql';
import { getMappedTypeProperties } from './ag-grid-metadata.helper.js';
import {
  GeneralFilters,
  FilterType,
  Operators,
  SortDirection,
  CustomWhereKeys,
  ExtraArgsStrategy,
  RowDefaultValues,
} from '@node-yalc/datagrid/ag-grid.enum.js';

export {
  GeneralFilters,
  FilterType,
  Operators,
  SortDirection,
  CustomWhereKeys,
  ExtraArgsStrategy,
  RowDefaultValues,
};

registerEnumType(GeneralFilters, {
  name: 'GeneralFiltersEnum',
});

registerEnumType(FilterType, {
  name: 'FilterTypeEnum',
});

registerEnumType(Operators, {
  name: 'FilterOperatorsEnum',
});

registerEnumType(SortDirection, {
  name: 'SortDirection',
});

const fieldsEnumCache = new WeakMap();
export function entityFieldsEnumFactory<Entity>(
  entityModel: ClassType<Entity> | AnyFunction,
): { [index: string]: string } {
  let cached;
  /* istanbul ignore next */
  const prototype = !isClass(entityModel) ? entityModel.prototype : entityModel;
  if ((cached = fieldsEnumCache.get(prototype))) return cached;

  const properties: { [x in string | number]: any } = {};

  getMappedTypeProperties(prototype).map((v) => (properties[v] = v));

  type FieldsEnumType = keyof typeof properties;
  const FieldsEnum: { [P in FieldsEnumType]: P } = { ...properties };

  registerEnumType(FieldsEnum, {
    name: `${prototype.name}FieldEnum`,
  });

  fieldsEnumCache.set(prototype, FieldsEnum);

  return FieldsEnum;
}
