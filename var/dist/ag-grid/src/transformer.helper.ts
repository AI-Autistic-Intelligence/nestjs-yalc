import { deepMerge, objectSetProp } from '@nest-yalc-2/utils/object.helper';

export function JsonTransformer(field: string, propertyPath: string) {
  return (dstObj: Record<any, any>, srcValue: any) => {
    const patch = objectSetProp({}, propertyPath, srcValue);
    dstObj[field] = deepMerge(dstObj[field] ?? {}, patch);
  };
}
