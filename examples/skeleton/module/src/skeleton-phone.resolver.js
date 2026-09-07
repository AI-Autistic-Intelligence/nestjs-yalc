"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeletonPhoneProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const skeleton_phone_dto_js_1 = require("./skeleton-phone.dto.js");
const skeleton_phone_entity_js_1 = require("./skeleton-phone.entity.js");
const skeletonPhoneProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: skeleton_phone_entity_js_1.SkeletonPhone,
    resolver: {
        dto: skeleton_phone_dto_js_1.SkeletonPhoneType,
        input: {
            create: skeleton_phone_dto_js_1.SkeletonPhoneCreateInput,
            update: skeleton_phone_dto_js_1.SkeletonPhoneUpdateInput,
            conditions: skeleton_phone_dto_js_1.SkeletonPhoneCondition,
        },
        prefix: 'SkeletonModule_',
    },
    service: { dbConnection },
    dataloader: { databaseKey: 'phoneNumber', entityModel: skeleton_phone_dto_js_1.SkeletonPhoneType },
});
exports.skeletonPhoneProvidersFactory = skeletonPhoneProvidersFactory;
//# sourceMappingURL=skeleton-phone.resolver.js.map