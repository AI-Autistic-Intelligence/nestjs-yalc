import type { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import type { DeepPartial, FindOptionsWhere } from 'typeorm';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniExternalRefBindingValidator } from './omni-external-ref-binding.validator.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
import { OmniScopedService } from './omni-scoped.service.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
export interface OmniExternalRefLookup {
    provider: string;
    externalId: string;
    account?: string | null;
    container?: string | null;
}
export interface OmniExternalRefSyncInput extends OmniExternalRefLookup {
    payload?: Record<string, unknown> | null;
}
export type OmniExternalRefUpsertInput = Omit<DeepPartial<OmniExternalRefEntity>, 'provider' | 'externalId' | 'internalType' | 'internalId'> & Pick<OmniExternalRefEntity, 'provider' | 'externalId' | 'internalType' | 'internalId'>;
export declare class OmniExternalRefService extends OmniScopedService<OmniExternalRefEntity> {
    private readonly bindingValidator;
    constructor(repository: any, scopeOrRepositoryWrite: OmniScope | any | undefined, deletion: OmniDeletePolicy, bindingValidator: OmniExternalRefBindingValidator);
    findByExternalIdentity({ provider, externalId, account, container, }: OmniExternalRefLookup): Promise<OmniExternalRefEntity | null>;
    findForInternalRecord(internalType: OmniExternalRefInternalType, internalId: string, provider?: string): Promise<OmniExternalRefEntity[]>;
    upsertExternalRef(input: OmniExternalRefUpsertInput): Promise<OmniExternalRefEntity>;
    syncDocumentReference(internalId: string, input: OmniExternalRefSyncInput): Promise<OmniExternalRefEntity>;
    syncCollectionReference(internalId: string, input: OmniExternalRefSyncInput): Promise<OmniExternalRefEntity>;
    createEntity(input: DeepPartial<OmniExternalRefEntity>, findOptions?: CrudGenFindManyOptions<OmniExternalRefEntity>, returnEntity?: true): Promise<OmniExternalRefEntity>;
    createEntity(input: DeepPartial<OmniExternalRefEntity>, findOptions?: CrudGenFindManyOptions<OmniExternalRefEntity>, returnEntity?: boolean): Promise<OmniExternalRefEntity | boolean>;
    updateEntity(conditions: FindOptionsWhere<OmniExternalRefEntity>, input: DeepPartial<OmniExternalRefEntity>, findOptions?: CrudGenFindManyOptions<OmniExternalRefEntity>, returnEntity?: true): Promise<OmniExternalRefEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniExternalRefEntity>, input: DeepPartial<OmniExternalRefEntity>, findOptions?: CrudGenFindManyOptions<OmniExternalRefEntity>, returnEntity?: boolean): Promise<OmniExternalRefEntity | boolean>;
    private assertBinding;
    private rejectBindingMutation;
    private normalizeExternalIdentity;
}
