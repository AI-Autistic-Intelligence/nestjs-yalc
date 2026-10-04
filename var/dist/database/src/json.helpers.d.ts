export declare const NYALC_JSON_FIELD_META_KEY: unique symbol;
export declare const NYALC_JSON_VIRTUAL_FIELD_META_KEY = "nestjs_yalc_json_virtual_field_meta_key";
export declare function isJsonSQLRaw(sql: string): boolean;
export declare function JsonField(): (target: any, property: string | symbol) => void;
