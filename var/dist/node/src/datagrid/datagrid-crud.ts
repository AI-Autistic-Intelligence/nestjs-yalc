export interface DataGridRequest {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchQuery?: string;
}

export interface DataGridResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class FerroxDataGridEngine {
  public static paginate<T>(items: T[], request: DataGridRequest): DataGridResponse<T> {
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
      filtered.sort((a: any, b: any) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
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

export class FerroxCrudGenerator {
  public static createCrudRoutes<T extends { id: string | number }>(
    entityName: string,
    repository: {
      find: () => Promise<T[]> | T[];
      findById: (id: any) => Promise<T | null> | T | null;
      create: (item: Partial<T>) => Promise<T> | T;
      delete: (id: any) => Promise<boolean> | boolean;
    }
  ) {
    const basePath = `/api/v1/${entityName.toLowerCase()}s`;
    return [
      {
        method: 'GET' as const,
        path: basePath,
        handler: async () => await repository.find(),
      },
      {
        method: 'GET' as const,
        path: `${basePath}/:id`,
        handler: async (req: any) => {
          const item = await repository.findById(req.params.id);
          if (!item) throw new Error(`${entityName} not found`);
          return item;
        },
      },
      {
        method: 'POST' as const,
        path: basePath,
        handler: async (req: any) => await repository.create(req.body),
      },
      {
        method: 'DELETE' as const,
        path: `${basePath}/:id`,
        handler: async (req: any) => {
          const success = await repository.delete(req.params.id);
          return { success };
        },
      },
    ];
  }
}
