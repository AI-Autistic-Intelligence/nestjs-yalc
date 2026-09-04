import { InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Exclude, Expose } from 'class-transformer';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar.js';
import returnValue from '@nestjs-yalc/utils/returnValue.js';
import { ModelField, ModelObject, FilterOptionType, } from '../object.decorator.js';
import { assertProjectionResourceDefinition, } from './projection-resource.js';
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
        ? Int
        : codec === 'boolean'
            ? Boolean
            : codec === 'json'
                ? GraphQLJSON
                : codec === 'uuid'
                    ? UUIDScalar
                    : String;
}
function applyField(target, field, options = {}) {
    const type = typeForCodec(field.codec);
    const nullable = options.required ? false : field.nullable;
    ModelField({
        dst: field.name,
        gqlType: returnValue(type),
        gqlOptions: { nullable },
    })(target.prototype, field.name);
    Expose()(target.prototype, field.name);
}
function projectionFields(definition) {
    return [...definition.fields];
}
export function createProjectionGraphqlTypes(definition, names) {
    assertProjectionResourceDefinition(definition);
    const object = namedClass(names.object);
    ObjectType(names.object)(object);
    ModelObject({
        filters: {
            type: FilterOptionType.INCLUDE,
            fields: projectionFields(definition)
                .filter((field) => (field.query?.filter?.length ?? 0) > 0 ||
                field.query?.sort === true)
                .map((field) => field.name),
        },
    })(object);
    Exclude()(object);
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
    InputType(names.create)(create);
    ModelObject()(create);
    for (const field of projectionFields(definition)) {
        applyField(create, field, { required: field.requiredOnCreate === true });
    }
    if (definition.payload.allowCreate) {
        applyField(create, { name: 'payload', codec: 'json', nullable: true });
    }
    const patch = namedClass(names.patch);
    InputType(names.patch)(patch);
    ModelObject()(patch);
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
    InputType(names.conditions)(conditions);
    ModelObject()(conditions);
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