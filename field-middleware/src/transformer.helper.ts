import { DateHelper } from '@nest-yalc-2/utils/date.helper';
import { belongsToEnum } from '@nest-yalc-2/utils/enum.helper';
import { ValueTransformer } from 'typeorm';

/**
 * Function for transforming the unfitting enum data to null after reading it from the database
 * @param enumName: enum object for checking if the column value belongs to it
 * @returns ValueTransformer object
 */
export const enumTransformer = <T extends Record<string, any>>(
  enumName: T,
): ValueTransformer => {
  const transformer = (value: string | number): string | number | null => {
    return belongsToEnum(enumName, value) ? value : null;
  };

  return {
    to: (value): unknown => value, // no transformation for writing
    from: transformer,
  };
};

export const defaultDateTransformer = (): {
  from: (value: Date) => Date;
  to: (value?: Date) => string | Date;
} => {
  const transform = (value?: Date): string | Date => {
    if (!value) {
      return DateHelper.dateToSQLDateTime(new Date());
    }

    return value;
  };

  return {
    from: (value: Date): Date => value,
    to: transform,
  };
};
