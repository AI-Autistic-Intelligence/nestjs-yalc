import { OmniRecordEntity } from './base/omni-record.entity.js';
import { omniScopedBackendProvidersFactory } from './omni-scoped.backend.js';
import { OmniRecordService } from './omni-record.service.js';
export const omniRecordBackendProvidersFactory = (dbConnection, reservedRecordKinds = []) => omniScopedBackendProvidersFactory({
    entityModel: OmniRecordEntity,
    dbConnection,
    createService: (repository, scope, options) => new OmniRecordService(repository, scope, options.deletion.record, reservedRecordKinds),
});
//# sourceMappingURL=omni-record.backend.js.map