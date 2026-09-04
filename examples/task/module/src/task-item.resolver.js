"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskItemProvidersFactory = void 0;
const crud_gen_helpers_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers.js");
const task_item_dto_js_1 = require("./task-item.dto.js");
const task_item_entity_js_1 = require("./task-item.entity.js");
const taskItemProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: task_item_entity_js_1.TaskItem,
    resolver: {
        dto: task_item_dto_js_1.TaskItemType,
        input: {
            create: task_item_dto_js_1.TaskItemCreateInput,
            update: task_item_dto_js_1.TaskItemUpdateInput,
            conditions: task_item_dto_js_1.TaskItemCondition,
        },
        prefix: 'TaskSystem_',
    },
    service: {
        dbConnection,
        entityModel: task_item_entity_js_1.TaskItem,
    },
    dataloader: { databaseKey: 'guid' },
});
exports.taskItemProvidersFactory = taskItemProvidersFactory;
//# sourceMappingURL=task-item.resolver.js.map