"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryHelper = void 0;
const typeorm_1 = require("typeorm");
class RepositoryHelper {
    static getCustomRepository(connection, entity) {
        const entityRepositoryMetadataArgs = (0, typeorm_1.getMetadataArgsStorage)().entityRepositories.find(function (repository) {
            return repository.target === entity.constructor;
        });
        if (!entityRepositoryMetadataArgs)
            throw new typeorm_1.CustomRepositoryNotFoundError(entity);
        const entityMetadata = entityRepositoryMetadataArgs.entity
            ? connection.getMetadata(entityRepositoryMetadataArgs.entity)
            : undefined;
        const entityRepositoryInstance = new entityRepositoryMetadataArgs.target(this, entityMetadata);
        if (entityRepositoryInstance instanceof typeorm_1.AbstractRepository) {
            if (!entityRepositoryInstance['manager'])
                entityRepositoryInstance['manager'] = this;
        }
        if (entityRepositoryInstance instanceof typeorm_1.Repository) {
            if (!entityMetadata)
                throw new typeorm_1.CustomRepositoryCannotInheritRepositoryError(entity);
            entityRepositoryInstance['manager'] = this;
            entityRepositoryInstance['metadata'] = entityMetadata;
        }
        return entityRepositoryInstance;
    }
}
exports.RepositoryHelper = RepositoryHelper;
//# sourceMappingURL=repository.helper.js.map