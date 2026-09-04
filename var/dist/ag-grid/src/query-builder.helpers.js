import { SelectQueryBuilder } from 'typeorm';
import { getAgGridFieldMetadataList, } from './object.decorator';
import { formatRawSelection } from "./ag-grid-query.helper";
import { getDestinationFieldName } from "./ag-grid-metadata.helper";
SelectQueryBuilder.prototype.getMany = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    const items = entities.map((entity, index) => {
        const metaInfo = getAgGridFieldMetadataList(entity.constructor) ?? {};
        const item = raw[index];
        for (const [propertyKey, field] of Object.entries(metaInfo)) {
            if (field.mode === 'derived' && field.dst) {
                const itemKey = formatRawSelection(getDestinationFieldName(field.dst), propertyKey, '', true);
                entity[propertyKey] = item[itemKey];
            }
        }
        return entity;
    });
    return [...items];
};
SelectQueryBuilder.prototype.getOne = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    if (!Array.isArray(entities) || entities.length <= 0)
        return entities[0];
    const metaInfo = getAgGridFieldMetadataList(entities[0].constructor) ?? {};
    for (const [propertyKey, field] of Object.entries(metaInfo)) {
        if (field.mode === 'derived' && field.dst) {
            const itemKey = formatRawSelection(getDestinationFieldName(field.dst), propertyKey, '', true);
            entities[0][propertyKey] = raw[0][itemKey];
        }
    }
    return entities[0];
};
export class SelectQueryBuilderPatched extends SelectQueryBuilder {
}
//# sourceMappingURL=query-builder.helpers.js.map