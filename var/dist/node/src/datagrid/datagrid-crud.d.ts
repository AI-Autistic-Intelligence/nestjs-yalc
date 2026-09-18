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
export declare class FerroxDataGridEngine {
    static paginate<T>(items: T[], request: DataGridRequest): DataGridResponse<T>;
}
export declare class FerroxCrudGenerator {
    static createCrudRoutes<T extends {
        id: string | number;
    }>(entityName: string, repository: {
        find: () => Promise<T[]> | T[];
        findById: (id: any) => Promise<T | null> | T | null;
        create: (item: Partial<T>) => Promise<T> | T;
        delete: (id: any) => Promise<boolean> | boolean;
    }): ({
        method: "GET";
        path: string;
        handler: () => Promise<T[]>;
    } | {
        method: "GET";
        path: string;
        handler: (req: any) => Promise<T>;
    } | {
        method: "POST";
        path: string;
        handler: (req: any) => Promise<T>;
    } | {
        method: "DELETE";
        path: string;
        handler: (req: any) => Promise<{
            success: boolean;
        }>;
    })[];
}
