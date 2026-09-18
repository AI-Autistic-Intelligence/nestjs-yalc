"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxCrudGenerator = exports.FerroxDataGridEngine = void 0;
class FerroxDataGridEngine {
    static paginate(items, request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 10);
        let filtered = [...items];
        if (request.searchQuery) {
            const q = request.searchQuery.toLowerCase();
            filtered = filtered.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
        }
        if (request.sortField) {
            const field = request.sortField;
            const order = request.sortOrder === 'DESC' ? -1 : 1;
            filtered.sort((a, b) => {
                if (a[field] < b[field])
                    return -1 * order;
                if (a[field] > b[field])
                    return 1 * order;
                return 0;
            });
        }
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const data = filtered.slice(start, start + pageSize);
        return {
            data,
            total,
            page,
            pageSize,
            totalPages,
        };
    }
}
exports.FerroxDataGridEngine = FerroxDataGridEngine;
class FerroxCrudGenerator {
    static createCrudRoutes(entityName, repository) {
        const basePath = `/api/v1/${entityName.toLowerCase()}s`;
        return [
            {
                method: 'GET',
                path: basePath,
                handler: async () => await repository.find(),
            },
            {
                method: 'GET',
                path: `${basePath}/:id`,
                handler: async (req) => {
                    const item = await repository.findById(req.params.id);
                    if (!item)
                        throw new Error(`${entityName} not found`);
                    return item;
                },
            },
            {
                method: 'POST',
                path: basePath,
                handler: async (req) => await repository.create(req.body),
            },
            {
                method: 'DELETE',
                path: `${basePath}/:id`,
                handler: async (req) => {
                    const success = await repository.delete(req.params.id);
                    return { success };
                },
            },
        ];
    }
}
exports.FerroxCrudGenerator = FerroxCrudGenerator;
//# sourceMappingURL=datagrid-crud.js.map