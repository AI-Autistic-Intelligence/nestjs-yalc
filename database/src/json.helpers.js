"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NYALC_JSON_VIRTUAL_FIELD_META_KEY = exports.NYALC_JSON_FIELD_META_KEY = void 0;
exports.isJsonSQLRaw = isJsonSQLRaw;
exports.JsonField = JsonField;
exports.NYALC_JSON_FIELD_META_KEY = Symbol('nestjs_yalc_json_field_meta_key');
exports.NYALC_JSON_VIRTUAL_FIELD_META_KEY = 'nestjs_yalc_json_virtual_field_meta_key';
function isJsonSQLRaw(sql) {
    return sql.includes('->') && sql.includes('$.');
}
function JsonField() {
    return (target, property) => {
        const propertyName = property.toString();
        const metadata = Object.assign({}, Reflect.getMetadata(exports.NYALC_JSON_FIELD_META_KEY, target));
        metadata[propertyName] = true;
        Reflect.defineMetadata(exports.NYALC_JSON_FIELD_META_KEY, metadata, target);
    };
}
//# sourceMappingURL=json.helpers.js.map