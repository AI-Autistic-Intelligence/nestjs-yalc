"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCreateMutation = defineCreateMutation;
exports.defineUpdateMutation = defineUpdateMutation;
exports.defineDeleteMutation = defineDeleteMutation;
const class_helper_1 = require("@nestjs-yalc/utils/class.helper");
const nest_decorator_1 = require("@nestjs-yalc/utils/nest.decorator");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const generic_resolver_type_1 = require("./generic-resolver.type");
const gqlmapper_decorator_1 = require("./gqlmapper.decorator");
function defineCreateMutation(queryName, returnType, resolver, options, methodOptions) {
    var _a, _b, _c, _d, _e;
    const extraInputs = methodOptions.extraInputs;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (input, findOptions, ctx, extraInputsArgs) {
            const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
            if (extraInputs)
                Object.keys(extraInputs).forEach((k) => {
                    const extraInputObj = extraInputs[k];
                    if ((0, generic_resolver_type_1.isExtraInputStrict)(extraInputObj)) {
                        if (!extraInputsArgs) {
                            extraInputsArgs = {};
                        }
                        extraInputsArgs[k] = extraInputObj.middleware(gqlCtx, input, extraInputsArgs[k]);
                    }
                });
            return this.service.createEntity(input, findOptions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(graphql_1.Mutation, queryName, (_a = methodOptions.returnType) !== null && _a !== void 0 ? _a : (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_1.InputArgs)({
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.create) !== null && _b !== void 0 ? _b : returnType; },
        },
        fieldType: (_c = (_b = options.input) === null || _b === void 0 ? void 0 : _b.create) !== null && _c !== void 0 ? _c : returnType,
        _name: 'input',
    })(resolver.prototype, queryName, 0);
    const fieldType = (_e = (_d = methodOptions.returnType) === null || _d === void 0 ? void 0 : _d.call(methodOptions)) !== null && _e !== void 0 ? _e : returnType;
    const entityType = !(0, class_helper_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, ag_grid_args_decorator_1.AgGridArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 1);
    (0, nest_decorator_1.GetContext)()(resolver.prototype, queryName, 2);
    if (extraInputs) {
        Object.keys(extraInputs).forEach((k, i) => {
            const extraInputObj = extraInputs[k];
            if (!extraInputObj.gqlOptions)
                return;
            (0, gqlmapper_decorator_1.InputArgs)({
                gql: extraInputObj.gqlOptions,
                fieldType: extraInputObj.gqlOptions.type,
                _name: k,
            })(resolver.prototype, queryName, 3 + i);
        });
    }
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
function defineUpdateMutation(queryName, returnType, resolver, options, methodOptions) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (conditions, input, findOptions) {
            return this.service.updateEntity(conditions, input, findOptions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(graphql_1.Mutation, `${(_a = options.prefix) !== null && _a !== void 0 ? _a : ''}update${options.entityModel.name}`, (_b = methodOptions.returnType) !== null && _b !== void 0 ? _b : (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_1.InputArgs)({
        fieldType: (_d = (_c = options.input) === null || _c === void 0 ? void 0 : _c.conditions) !== null && _d !== void 0 ? _d : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    (0, gqlmapper_decorator_1.InputArgs)({
        fieldType: (_f = (_e = options.input) === null || _e === void 0 ? void 0 : _e.update) !== null && _f !== void 0 ? _f : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.update) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'input',
    })(resolver.prototype, queryName, 1);
    const fieldType = (_h = (_g = methodOptions.returnType) === null || _g === void 0 ? void 0 : _g.call(methodOptions)) !== null && _h !== void 0 ? _h : returnType;
    const entityType = !(0, class_helper_1.isClass)(fieldType) && typeof fieldType === 'function'
        ? fieldType()
        : fieldType;
    (0, ag_grid_args_decorator_1.AgGridArgsSingle)({
        fieldType,
        entityType,
    })(resolver.prototype, queryName, 2);
    Reflect.metadata('design:paramtypes', [Object, Object])(resolver.prototype, queryName);
}
function defineDeleteMutation(queryName, returnType, resolver, options, methodOptions) {
    var _a, _b;
    Object.defineProperty(resolver.prototype, queryName, {
        configurable: true,
        writable: true,
        value: async function (conditions) {
            return this.service.deleteEntity(conditions);
        },
    });
    const descriptor = Object.getOwnPropertyDescriptor(resolver.prototype, queryName);
    if (!descriptor)
        throw new ReferenceError(`${resolver.name}.${queryName} must have a descriptor`);
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(graphql_1.Mutation, queryName, (0, returnValue_1.default)(Boolean), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_1.InputArgs)({
        fieldType: (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType,
        gql: {
            type: () => { var _a, _b; return (_b = (_a = options.input) === null || _a === void 0 ? void 0 : _a.conditions) !== null && _b !== void 0 ? _b : returnType; },
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
//# sourceMappingURL=generic-mutation.resolver.js.map