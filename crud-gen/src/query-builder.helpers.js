"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectQueryBuilderPatched = void 0;
const typeorm_1 = require("typeorm");
const crud_gen_helpers_js_1 = require("./crud-gen.helpers.js");
const object_decorator_js_1 = require("./object.decorator.js");
typeorm_1.SelectQueryBuilder.prototype.getMany = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    const items = entities.map((entity, index) => {
        var _a;
        const metaInfo = (_a = (0, object_decorator_js_1.getModelFieldMetadataList)(entity.constructor)) !== null && _a !== void 0 ? _a : {};
        const item = raw[index];
        for (const [propertyKey, field] of Object.entries(metaInfo)) {
            if (field.mode === 'derived' && field.dst) {
                const itemKey = (0, crud_gen_helpers_js_1.formatRawSelection)((0, crud_gen_helpers_js_1.getDestinationFieldName)(field.dst), propertyKey, {
                    prefix: this.connection.driver.escape(this.alias),
                    onlyAlias: true,
                });
                entity[propertyKey] = item[itemKey];
            }
        }
        return entity;
    });
    return [...items];
};
typeorm_1.SelectQueryBuilder.prototype.getOne = async function () {
    var _a, _b;
    const { entities, raw } = await this.getRawAndEntities();
    if (!Array.isArray(entities) || entities.length <= 0)
        return (_a = entities[0]) !== null && _a !== void 0 ? _a : null;
    const metaInfo = (_b = (0, object_decorator_js_1.getModelFieldMetadataList)(entities[0].constructor)) !== null && _b !== void 0 ? _b : {};
    for (const [propertyKey, field] of Object.entries(metaInfo)) {
        if (field.mode === 'derived' && field.dst) {
            const itemKey = (0, crud_gen_helpers_js_1.formatRawSelection)((0, crud_gen_helpers_js_1.getDestinationFieldName)(field.dst), propertyKey, {
                prefix: this.connection.driver.escape(this.alias),
                onlyAlias: true,
            });
            entities[0][propertyKey] = raw[0][itemKey];
        }
    }
    return entities[0];
};
class SelectQueryBuilderPatched extends typeorm_1.SelectQueryBuilder {
}
exports.SelectQueryBuilderPatched = SelectQueryBuilderPatched;
//# sourceMappingURL=query-builder.helpers.js.map