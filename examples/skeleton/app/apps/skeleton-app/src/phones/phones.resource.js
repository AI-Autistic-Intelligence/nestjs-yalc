"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phonesResourceProviders = exports.PhonesController = exports.phonesResource = void 0;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const skeleton_module_1 = require("@nest-yalc-2/skeleton-module");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
exports.phonesResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: skeleton_module_1.SkeletonPhone,
    backend: {
        service: { dbConnection: 'default' },
        dataloader: { databaseKey: 'phoneNumber', entityModel: skeleton_module_1.SkeletonPhoneType },
    },
    graphql: {
        resolver: {
            dto: skeleton_module_1.SkeletonPhoneType,
            input: {
                create: skeleton_module_1.SkeletonPhoneCreateInput,
                update: skeleton_module_1.SkeletonPhoneUpdateInput,
                conditions: skeleton_module_1.SkeletonPhoneCondition,
            },
            prefix: 'SkeletonModule_',
        },
    },
    rest: {
        dto: skeleton_module_1.SkeletonPhoneType,
        path: 'phones',
        idField: 'ID',
        mutations: {
            create: { decorators: [] },
            update: { decorators: [] },
        },
    },
});
exports.PhonesController = exports.phonesResource.controllers[0];
exports.phonesResourceProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.phonesResource.providers);
//# sourceMappingURL=phones.resource.js.map