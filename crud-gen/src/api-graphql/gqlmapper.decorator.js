"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputArgs = exports.InputArgsMapper = exports.GqlArgsGenerator = exports.GqlFieldsAsArgsWorker = void 0;
const crud_gen_helpers_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers.js");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const GqlFieldsAsArgsWorker = (data, info) => {
    const keys = {};
    for (const key of Object.keys(info)) {
        const dst = (0, crud_gen_helpers_js_1.columnConversion)(key, data);
        keys[dst] = info[key];
    }
    return keys;
};
exports.GqlFieldsAsArgsWorker = GqlFieldsAsArgsWorker;
const GqlArgsGenerator = (data, ctx) => {
    var _a, _b, _c, _d;
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const args = gqlCtx.getArgs();
    const fieldType = (_a = data.fieldType) !== null && _a !== void 0 ? _a : data.fieldMap;
    const arg = args[(_d = (_c = (_b = data.gql) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : data._name) !== null && _d !== void 0 ? _d : 'input'];
    if (fieldType && typeof arg === 'object') {
        const fieldMapperAndFilter = (0, crud_gen_helpers_js_1.objectToFieldMapper)(fieldType);
        return (0, exports.GqlFieldsAsArgsWorker)(fieldMapperAndFilter.field, arg);
    }
    return args;
};
exports.GqlArgsGenerator = GqlArgsGenerator;
exports.InputArgsMapper = (0, common_1.createParamDecorator)(exports.GqlArgsGenerator);
const InputArgs = (params) => {
    var _a, _b;
    const args = (0, graphql_1.Args)((_a = params._name) !== null && _a !== void 0 ? _a : 'input', (_b = params.gql) !== null && _b !== void 0 ? _b : {});
    const mapper = (0, exports.InputArgsMapper)(params);
    return function (target, key, index) {
        args(target, key, index);
        mapper(target, key, index);
    };
};
exports.InputArgs = InputArgs;
//# sourceMappingURL=gqlmapper.decorator.js.map