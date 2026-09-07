"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExternalRefProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const task_external_ref_dto_js_1 = require("./task-external-ref.dto.js");
const task_external_ref_entity_js_1 = require("./task-external-ref.entity.js");
const taskExternalRefProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: task_external_ref_entity_js_1.TaskExternalRef,
    resolver: {
        dto: task_external_ref_dto_js_1.TaskExternalRefType,
        input: {
            create: task_external_ref_dto_js_1.TaskExternalRefCreateInput,
            update: task_external_ref_dto_js_1.TaskExternalRefUpdateInput,
            conditions: task_external_ref_dto_js_1.TaskExternalRefCondition,
        },
        prefix: 'TaskSystem_',
    },
    service: {
        dbConnection,
        entityModel: task_external_ref_entity_js_1.TaskExternalRef,
    },
    dataloader: { databaseKey: 'guid' },
});
exports.taskExternalRefProvidersFactory = taskExternalRefProvidersFactory;
//# sourceMappingURL=task-external-ref.resolver.js.map