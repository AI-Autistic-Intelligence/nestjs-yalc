import type { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import type { GenericTypeORMRepository } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import type { DeepPartial, FindOptionsWhere } from 'typeorm';
import { OmniDocumentEntity } from './omni-document.entity.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
import { OmniScopedService } from './omni-scoped.service.js';
export declare class OmniDocumentService extends OmniScopedService<OmniDocumentEntity> {
    constructor(repository: GenericTypeORMRepository<OmniDocumentEntity>, scopeOrRepositoryWrite?: OmniScope | GenericTypeORMRepository<OmniDocumentEntity>, deletion?: OmniDeletePolicy);
    protected normalizeDocumentInput(input: DeepPartial<OmniDocumentEntity>): DeepPartial<OmniDocumentEntity>;
    createEntity(input: DeepPartial<OmniDocumentEntity>, findOptions?: CrudGenFindManyOptions<OmniDocumentEntity>, returnEntity?: true): Promise<OmniDocumentEntity>;
    createEntity(input: DeepPartial<OmniDocumentEntity>, findOptions?: CrudGenFindManyOptions<OmniDocumentEntity>, returnEntity?: boolean): Promise<OmniDocumentEntity | boolean>;
    updateEntity(conditions: FindOptionsWhere<OmniDocumentEntity>, input: DeepPartial<OmniDocumentEntity>, findOptions?: CrudGenFindManyOptions<OmniDocumentEntity>, returnEntity?: true): Promise<OmniDocumentEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniDocumentEntity>, input: DeepPartial<OmniDocumentEntity>, findOptions?: CrudGenFindManyOptions<OmniDocumentEntity>, returnEntity?: boolean): Promise<OmniDocumentEntity | boolean>;
}
