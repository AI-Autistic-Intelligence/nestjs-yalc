"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCreateMutation = defineCreateMutation;
exports.defineUpdateMutation = defineUpdateMutation;
exports.defineDeleteMutation = defineDeleteMutation;
const class_helper_1 = require("@nest-yalc-2/utils/class.helper");
const nest_decorator_1 = require("@nest-yalc-2/utils/nest.decorator");
const returnValue_1 = __importDefault(require("@nest-yalc-2/utils/returnValue"));
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const generic_resolver_type_1 = require("./generic-resolver.type");
const gqlmapper_decorator_1 = require("./gqlmapper.decorator");
function defineCreateMutation(queryName, returnType, resolver, options, methodOptions) {
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
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(graphql_1.Mutation, queryName, methodOptions.returnType ?? (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_1.InputArgs)({
        gql: {
            type: () => options.input?.create ?? returnType,
        },
        fieldType: options.input?.create ?? returnType,
        _name: 'input',
    })(resolver.prototype, queryName, 0);
    const fieldType = methodOptions.returnType?.() ?? returnType;
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
    (0, common_1.applyDecorators)(...(0, generic_resolver_type_1.generateDecorators)(graphql_1.Mutation, `${options.prefix ?? ''}update${options.entityModel.name}`, methodOptions.returnType ?? (0, returnValue_1.default)(returnType), methodOptions))(resolver.prototype, queryName, descriptor);
    (0, gqlmapper_decorator_1.InputArgs)({
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    (0, gqlmapper_decorator_1.InputArgs)({
        fieldType: options.input?.update ?? returnType,
        gql: {
            type: () => options.input?.update ?? returnType,
        },
        _name: 'input',
    })(resolver.prototype, queryName, 1);
    const fieldType = methodOptions.returnType?.() ?? returnType;
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
        fieldType: options.input?.conditions ?? returnType,
        gql: {
            type: () => options.input?.conditions ?? returnType,
        },
        _name: 'conditions',
    })(resolver.prototype, queryName, 0);
    Reflect.metadata('design:paramtypes', [Object])(resolver.prototype, queryName);
}
//# sourceMappingURL=generic-mutation.resolver.js.map