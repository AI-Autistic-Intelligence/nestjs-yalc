import { createParamDecorator } from '@nestjs/common';
import { Args, GqlExecutionContext, } from '@nestjs/graphql';
import { columnConversion, objectToFieldMapper } from "@nestjs-yalc/ag-grid/ag-grid-metadata.helper";
export const GqlFieldsAsArgsWorker = (data, info) => {
    const keys = {};
    for (const key of Object.keys(info)) {
        const dst = columnConversion(key, data);
        keys[dst] = info[key];
    }
    return keys;
};
export const GqlArgsGenerator = (data, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const args = gqlCtx.getArgs();
    const fieldType = data.fieldType ?? data.fieldMap;
    const arg = args[data.gql?.name ?? data._name ?? 'input'];
    if (fieldType && typeof arg === 'object') {
        const fieldMapperAndFilter = objectToFieldMapper(fieldType);
        return GqlFieldsAsArgsWorker(fieldMapperAndFilter.field, arg);
    }
    return args;
};
export const InputArgsMapper = createParamDecorator(GqlArgsGenerator);
export const InputArgs = (params) => {
    const args = Args(params._name ?? 'input', params.gql ?? {});
    const mapper = InputArgsMapper(params);
    return function (target, key, index) {
        args(target, key, index);
        mapper(target, key, index);
    };
};
//# sourceMappingURL=gqlmapper.decorator.js.map