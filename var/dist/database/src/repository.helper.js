import { AbstractRepository, CustomRepositoryCannotInheritRepositoryError, CustomRepositoryNotFoundError, getMetadataArgsStorage, Repository, } from 'typeorm';
export class RepositoryHelper {
    static getCustomRepository(connection, entity) {
        const entityRepositoryMetadataArgs = getMetadataArgsStorage().entityRepositories.find(function (repository) {
            return repository.target === entity.constructor;
        });
        if (!entityRepositoryMetadataArgs)
            throw new CustomRepositoryNotFoundError(entity);
        const entityMetadata = entityRepositoryMetadataArgs.entity
            ? connection.getMetadata(entityRepositoryMetadataArgs.entity)
            : undefined;
        const entityRepositoryInstance = new entityRepositoryMetadataArgs.target(this, entityMetadata);
        if (entityRepositoryInstance instanceof AbstractRepository) {
            if (!entityRepositoryInstance['manager'])
                entityRepositoryInstance['manager'] = this;
        }
        if (entityRepositoryInstance instanceof Repository) {
            if (!entityMetadata)
                throw new CustomRepositoryCannotInheritRepositoryError(entity);
            entityRepositoryInstance['manager'] = this;
            entityRepositoryInstance['metadata'] = entityMetadata;
        }
        return entityRepositoryInstance;
    }
}
//# sourceMappingURL=repository.helper.js.map