import type { IHttpCallStrategy } from '@nestjs-yalc/api-strategy';
import type { TaskProjectCreateInput, TaskProjectType } from '../task-project.dto.js';
import type { TaskItemCreateInput, TaskItemType, TaskItemUpdateInput } from '../task-item.dto.js';
export declare const TASKS_CLIENT_API_STRATEGY = "TASKS_CLIENT_API_STRATEGY";
export declare const TASKS_CLIENT_LOCAL_API_STRATEGY = "TASKS_CLIENT_LOCAL_API_STRATEGY";
export declare const TASKS_CLIENT_HTTP_API_STRATEGY = "TASKS_CLIENT_HTTP_API_STRATEGY";
export type TaskClientQuery = Record<string, string | number | boolean | undefined>;
export interface TaskClientPageData {
    startRow: number;
    count: number;
    [key: string]: unknown;
}
export interface TaskClientListResponse<TItem> {
    list: TItem[];
    pageData: TaskClientPageData;
}
export declare class TasksApiClient {
    private readonly api;
    constructor(api: IHttpCallStrategy);
    listTasks(query?: TaskClientQuery): Promise<TaskClientListResponse<TaskItemType>>;
    listProjectTasks(projectId: string): Promise<TaskClientListResponse<TaskItemType>>;
    getTask(taskId: string): Promise<TaskItemType>;
    createTask(payload: TaskItemCreateInput): Promise<TaskItemType>;
    updateTask(taskId: string, payload: TaskItemUpdateInput): Promise<TaskItemType>;
    createProject(payload: TaskProjectCreateInput): Promise<TaskProjectType>;
}
