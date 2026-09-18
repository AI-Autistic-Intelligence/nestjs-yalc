import { type Repository } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
import type { OmniScope } from './omni-scope.js';
export interface OmniExternalRefBinding {
    internalId: string;
    internalType: OmniExternalRefInternalType;
}
export declare class OmniExternalRefBindingValidator {
    private readonly recordRepository;
    private readonly scope;
    constructor(recordRepository: Repository<OmniRecordEntity>, scope: OmniScope);
    assertTarget(binding: OmniExternalRefBinding): Promise<OmniRecordEntity>;
}
