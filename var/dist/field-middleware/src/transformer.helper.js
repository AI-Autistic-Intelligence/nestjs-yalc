import { DateHelper } from '@nestjs-yalc/utils/date.helper';
import { belongsToEnum } from '@nestjs-yalc/utils/enum.helper';
export const enumTransformer = (enumName) => {
    const transformer = (value) => {
        return belongsToEnum(enumName, value) ? value : null;
    };
    return {
        to: (value) => value,
        from: transformer,
    };
};
export const defaultDateTransformer = () => {
    const transform = (value) => {
        if (!value) {
            return DateHelper.dateToSQLDateTime(new Date());
        }
        return value;
    };
    return {
        from: (value) => value,
        to: transform,
    };
};
//# sourceMappingURL=transformer.helper.js.map