import { assertProjectionResourceDefinition, } from './projection-resource.js';
function typeForCodec(codec) {
    if (codec === 'integer')
        return Number;
    if (codec === 'boolean')
        return Boolean;
    return String;
}
export function createProjectionSchemaOptions(definition, dialect) {
    assertProjectionResourceDefinition(definition);
    const columns = {
        [definition.scope.column]: { type: String, length: 64 },
        [definition.revision.column]: { type: Number, default: 1 },
        [definition.payload.column]: {
            type: dialect.payloadColumnType,
            nullable: false,
        },
    };
    for (const field of definition.fields) {
        if (field.storage !== 'column')
            continue;
        columns[field.column ?? field.name] = {
            type: typeForCodec(field.codec),
            nullable: field.nullable,
            ...(field.codec === 'string' ||
                field.codec === 'uuid' ||
                field.codec === 'instant'
                ? { length: 255 }
                : {}),
        };
    }
    return {
        columns,
        indices: definition.identity.uniqueWithinScope
            ? [
                {
                    name: `${definition.tableName}_scope_${definition.identity.column}_unique`,
                    columns: [definition.scope.column, definition.identity.column],
                    unique: true,
                },
            ]
            : [],
    };
}
//# sourceMappingURL=projection-schema.js.map