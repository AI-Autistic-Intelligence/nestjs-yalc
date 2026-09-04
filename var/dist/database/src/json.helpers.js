export const NYALC_JSON_FIELD_META_KEY = Symbol('nestjs_yalc_json_field_meta_key');
export const NYALC_JSON_VIRTUAL_FIELD_META_KEY = 'nestjs_yalc_json_virtual_field_meta_key';
export function isJsonSQLRaw(sql) {
    return sql.includes('->') && sql.includes('$.');
}
export function JsonField() {
    return (target, property) => {
        const propertyName = property.toString();
        const metadata = {
            ...Reflect.getMetadata(NYALC_JSON_FIELD_META_KEY, target),
        };
        metadata[propertyName] = true;
        Reflect.defineMetadata(NYALC_JSON_FIELD_META_KEY, metadata, target);
    };
}
//# sourceMappingURL=json.helpers.js.map