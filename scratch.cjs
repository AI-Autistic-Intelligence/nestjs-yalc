const { TypeMetadataStorage } = require('@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage');
const { SortModel } = require('./crud-gen/src/api-graphql/crud-gen.input.js');

console.log('Class:', SortModel.name);
const classMetadata = TypeMetadataStorage.getClassDirectivesByTarget(SortModel);
console.log('Class Directives:', classMetadata);

const fields = TypeMetadataStorage.getObjectTypeMetadataByTarget(SortModel);
console.log('Object Type:', fields);

const inputFields = TypeMetadataStorage.getInputTypeMetadataByTarget(SortModel);
console.log('Input Type:', inputFields);

TypeMetadataStorage.getPropertiesByTarget = TypeMetadataStorage.getPropertiesByTarget || function(target) {
  const metadata = this.metadataByTargetCollection.get(target.prototype);
  return metadata ? metadata.fields : null;
}
console.log('All Class Metadata:', TypeMetadataStorage.metadataByTargetCollection.get(SortModel.prototype));
