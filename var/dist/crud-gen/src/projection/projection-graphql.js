"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectionGraphqlTypes = createProjectionGraphqlTypes;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const graphql_type_json_1 = require("graphql-type-json");
const class_transformer_1 = require("class-transformer");
const uuid_scalar_js_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const object_decorator_js_1 = require("../object.decorator.js");
const projection_resource_js_1 = require("./projection-resource.js");
function namedClass(name) {
    return {
        [name]: class {
            constructor(data) {
                Object.assign(this, data);
            }
        },
    }[name];
}
function typeForCodec(codec) {
    return codec === 'integer'
        ? graphql_1.Int
        : codec === 'boolean'
            ? Boolean
            : codec === 'json'
                ? graphql_type_json_1.GraphQLJSON
                : codec === 'uuid'
                    ? uuid_scalar_js_1.UUIDScalar
                    : String;
}
function applyField(target, field, options = {}) {
    const type = typeForCodec(field.codec);
    const nullable = options.required ? false : field.nullable;
    (0, object_decorator_js_1.ModelField)({
        dst: field.name,
        gqlType: (0, returnValue_js_1.default)(type),
        gqlOptions: { nullable },
    })(target.prototype, field.name);
    (0, class_transformer_1.Expose)()(target.prototype, field.name);
}
function projectionFields(definition) {
    return [...definition.fields];
}
function createProjectionGraphqlTypes(definition, names) {
    (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
    const object = namedClass(names.object);
    (0, graphql_1.ObjectType)(names.object)(object);
    (0, object_decorator_js_1.ModelObject)({
        filters: {
            type: object_decorator_js_1.FilterOptionType.INCLUDE,
            fields: projectionFields(definition)
                .filter((field) => (field.query?.filter?.length ?? 0) > 0 ||
                field.query?.sort === true)
                .map((field) => field.name),
        },
    })(object);
    (0, class_transformer_1.Exclude)()(object);
    for (const field of projectionFields(definition)) {
        applyField(object, field, { required: !field.nullable });
    }
    applyField(object, {
        name: definition.revision.column,
        codec: 'integer',
        nullable: false,
    });
    applyField(object, { name: 'payload', codec: 'json', nullable: true });
    const create = namedClass(names.create);
    (0, graphql_1.InputType)(names.create)(create);
    (0, object_decorator_js_1.ModelObject)()(create);
    for (const field of projectionFields(definition)) {
        applyField(create, field, { required: field.requiredOnCreate === true });
    }
    if (definition.payload.allowCreate) {
        applyField(create, { name: 'payload', codec: 'json', nullable: true });
    }
    const patch = namedClass(names.patch);
    (0, graphql_1.InputType)(names.patch)(patch);
    (0, object_decorator_js_1.ModelObject)()(patch);
    for (const field of projectionFields(definition)) {
        if (field.name === definition.identity.column)
            continue;
        applyField(patch, { ...field, nullable: true });
    }
    applyField(patch, {
        name: 'expectedRevision',
        codec: 'integer',
        nullable: false,
    }, { required: true });
    const conditions = namedClass(names.conditions);
    (0, graphql_1.InputType)(names.conditions)(conditions);
    (0, object_decorator_js_1.ModelObject)()(conditions);
    const identityField = definition.fields.find((field) => field.name === definition.identity.column);
    if (!identityField) {
        throw new TypeError(`Projection identity ${definition.identity.column} is not declared.`);
    }
    applyField(conditions, {
        name: definition.identity.column,
        codec: identityField.codec,
        nullable: false,
    }, { required: true });
    return { object, create, patch, conditions };
}
//# sourceMappingURL=projection-graphql.js.map