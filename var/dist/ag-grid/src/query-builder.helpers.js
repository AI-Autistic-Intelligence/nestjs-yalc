"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectQueryBuilderPatched = void 0;
const typeorm_1 = require("typeorm");
const object_decorator_1 = require("./object.decorator");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
typeorm_1.SelectQueryBuilder.prototype.getMany = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    const items = entities.map((entity, index) => {
        const metaInfo = (0, object_decorator_1.getAgGridFieldMetadataList)(entity.constructor) ?? {};
        const item = raw[index];
        for (const [propertyKey, field] of Object.entries(metaInfo)) {
            if (field.mode === 'derived' && field.dst) {
                const itemKey = (0, ag_grid_query_helper_1.formatRawSelection)((0, ag_grid_metadata_helper_1.getDestinationFieldName)(field.dst), propertyKey, '', true);
                entity[propertyKey] = item[itemKey];
            }
        }
        return entity;
    });
    return [...items];
};
typeorm_1.SelectQueryBuilder.prototype.getOne = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    if (!Array.isArray(entities) || entities.length <= 0)
        return entities[0];
    const metaInfo = (0, object_decorator_1.getAgGridFieldMetadataList)(entities[0].constructor) ?? {};
    for (const [propertyKey, field] of Object.entries(metaInfo)) {
        if (field.mode === 'derived' && field.dst) {
            const itemKey = (0, ag_grid_query_helper_1.formatRawSelection)((0, ag_grid_metadata_helper_1.getDestinationFieldName)(field.dst), propertyKey, '', true);
            entities[0][propertyKey] = raw[0][itemKey];
        }
    }
    return entities[0];
};
class SelectQueryBuilderPatched extends typeorm_1.SelectQueryBuilder {
}
exports.SelectQueryBuilderPatched = SelectQueryBuilderPatched;
//# sourceMappingURL=query-builder.helpers.js.map