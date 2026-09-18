"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputArgs = exports.InputArgsMapper = exports.GqlArgsGenerator = exports.GqlFieldsAsArgsWorker = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_metadata_helper_1 = require("@nest-yalc-2/ag-grid/ag-grid-metadata.helper");
const GqlFieldsAsArgsWorker = (data, info) => {
    const keys = {};
    for (const key of Object.keys(info)) {
        const dst = (0, ag_grid_metadata_helper_1.columnConversion)(key, data);
        keys[dst] = info[key];
    }
    return keys;
};
exports.GqlFieldsAsArgsWorker = GqlFieldsAsArgsWorker;
const GqlArgsGenerator = (data, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const args = gqlCtx.getArgs();
    const fieldType = data.fieldType ?? data.fieldMap;
    const arg = args[data.gql?.name ?? data._name ?? 'input'];
    if (fieldType && typeof arg === 'object') {
        const fieldMapperAndFilter = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(fieldType);
        return (0, exports.GqlFieldsAsArgsWorker)(fieldMapperAndFilter.field, arg);
    }
    return args;
};
exports.GqlArgsGenerator = GqlArgsGenerator;
exports.InputArgsMapper = (0, common_1.createParamDecorator)(exports.GqlArgsGenerator);
const InputArgs = (params) => {
    const args = (0, graphql_1.Args)(params._name ?? 'input', params.gql ?? {});
    const mapper = (0, exports.InputArgsMapper)(params);
    return function (target, key, index) {
        args(target, key, index);
        mapper(target, key, index);
    };
};
exports.InputArgs = InputArgs;
//# sourceMappingURL=gqlmapper.decorator.js.map