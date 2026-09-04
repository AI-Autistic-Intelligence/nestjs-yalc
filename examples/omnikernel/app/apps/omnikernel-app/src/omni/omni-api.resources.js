"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniApiControllers = exports.omniApiProviders = exports.omniExternalRefResource = exports.omniRelationResource = exports.omniCollectionResource = exports.omniDocumentResource = exports.omniRecordResource = exports.omniNamedResource = void 0;
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
exports.omniNamedResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniNamedEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniNamedType,
            input: {
                create: omnikernel_module_1.OmniNamedCreateInput,
                update: omnikernel_module_1.OmniNamedUpdateInput,
                conditions: omnikernel_module_1.OmniNamedCondition,
            },
            prefix: 'OmniKernel_',
        },
    },
    rest: {
        dto: omnikernel_module_1.OmniNamedType,
        path: 'omni/named',
        idField: 'guid',
    },
});
exports.omniRecordResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniRecordEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniRecordType,
            input: {
                create: omnikernel_module_1.OmniRecordCreateInput,
                update: omnikernel_module_1.OmniRecordUpdateInput,
                conditions: omnikernel_module_1.OmniRecordCondition,
            },
            prefix: 'OmniKernel_',
        },
    },
    rest: {
        dto: omnikernel_module_1.OmniRecordType,
        path: 'omni/records',
        idField: 'guid',
    },
});
exports.omniDocumentResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniDocumentEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniDocumentType,
            input: {
                create: omnikernel_module_1.OmniDocumentCreateInput,
                update: omnikernel_module_1.OmniDocumentUpdateInput,
                conditions: omnikernel_module_1.OmniDocumentCondition,
            },
            prefix: 'OmniKernel_',
        },
        serviceToken: omnikernel_module_1.OmniDocumentService.name,
    },
    rest: {
        dto: omnikernel_module_1.OmniDocumentType,
        path: 'omni/documents',
        idField: 'guid',
        serviceToken: omnikernel_module_1.OmniDocumentService.name,
    },
});
exports.omniCollectionResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniCollectionEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniCollectionType,
            input: {
                create: omnikernel_module_1.OmniCollectionCreateInput,
                update: omnikernel_module_1.OmniCollectionUpdateInput,
                conditions: omnikernel_module_1.OmniCollectionCondition,
            },
            prefix: 'OmniKernel_',
        },
        serviceToken: omnikernel_module_1.OmniCollectionService.name,
    },
    rest: {
        dto: omnikernel_module_1.OmniCollectionType,
        path: 'omni/collections',
        idField: 'guid',
        serviceToken: omnikernel_module_1.OmniCollectionService.name,
    },
});
exports.omniRelationResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniRelationEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniRelationType,
            input: {
                create: omnikernel_module_1.OmniRelationCreateInput,
                update: omnikernel_module_1.OmniRelationUpdateInput,
                conditions: omnikernel_module_1.OmniRelationCondition,
            },
            prefix: 'OmniKernel_',
        },
    },
    rest: {
        dto: omnikernel_module_1.OmniRelationType,
        path: 'omni/relations',
        idField: 'guid',
    },
});
exports.omniExternalRefResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: omnikernel_module_1.OmniExternalRefEntity,
    backend: false,
    graphql: {
        resolver: {
            dto: omnikernel_module_1.OmniExternalRefType,
            input: {
                create: omnikernel_module_1.OmniExternalRefCreateInput,
                update: omnikernel_module_1.OmniExternalRefUpdateInput,
                conditions: omnikernel_module_1.OmniExternalRefCondition,
            },
            prefix: 'OmniKernel_',
        },
        serviceToken: omnikernel_module_1.OmniExternalRefService.name,
    },
    rest: {
        dto: omnikernel_module_1.OmniExternalRefType,
        path: 'omni/external-refs',
        idField: 'guid',
        serviceToken: omnikernel_module_1.OmniExternalRefService.name,
    },
});
const omniResources = [
    exports.omniNamedResource,
    exports.omniRecordResource,
    exports.omniDocumentResource,
    exports.omniCollectionResource,
    exports.omniRelationResource,
    exports.omniExternalRefResource,
];
exports.omniApiProviders = omniResources.flatMap((resource) => (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(resource.providers));
exports.omniApiControllers = omniResources.flatMap((resource) => resource.controllers);
//# sourceMappingURL=omni-api.resources.js.map