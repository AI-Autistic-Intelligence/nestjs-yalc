import { OmniCollectionEntity, OmniExternalRefEntity, OmniExternalRefInternalType, OmniRecordEntity, OmniRecordStatus } from '@nest-yalc-2/omnikernel-module';
import { TaskItemCreateInput, TaskItemType } from '../tasks/task-item.dto';
import { TaskProjectCreateInput, TaskProjectType } from '../projects/task-project.dto';
import { TaskEventCreateInput, TaskEventType } from '../events/task-event.dto';
import { TaskExternalRefCreateInput, TaskExternalRefType } from '../sync/task-external-ref.dto';
export interface TaskItemOmniWriteInput extends Partial<TaskItemCreateInput> {
    referenceIds?: string[];
    relatedToIds?: string[];
}
export interface TaskOmniPageQuery {
    endRow?: number | string;
    projectId?: string;
    provider?: string;
    startRow?: number | string;
}
export declare class TaskAppOmniMapper {
    readonly taskKind = "task";
    readonly eventKind = "event";
    extractCrudGenFilterMap(where: unknown): Record<string, unknown>;
    mapProjectToOmniCollection(input: Partial<TaskProjectCreateInput>): Partial<OmniCollectionEntity>;
    mapOmniCollectionToProject(collection: OmniCollectionEntity): TaskProjectType;
    mapTaskToOmniRecord(input: Partial<TaskItemCreateInput>): Partial<OmniRecordEntity>;
    mapOmniRecordToTask(record: OmniRecordEntity, projectId?: string | null): TaskItemType;
    mapEventToOmniRecord(input: Partial<TaskEventCreateInput>): Partial<OmniRecordEntity>;
    mapOmniRecordToEvent(record: OmniRecordEntity, projectId?: string | null): TaskEventType;
    mapExternalRefToOmniExternalRef(input: Partial<TaskExternalRefCreateInput>): Partial<OmniExternalRefEntity>;
    mapOmniExternalRefToTask(ref: OmniExternalRefEntity): TaskExternalRefType;
    mapTaskExternalRefInternalType(value?: string | null): OmniExternalRefInternalType;
    mapOmniExternalRefInternalTypeToTaskType(value: OmniExternalRefInternalType): string;
    mapDomainStatusToOmniStatus(status?: string | null): OmniRecordStatus;
    mapOmniStatusToDomainStatus(status: OmniRecordStatus): string;
    normalizeDateInput(value?: Date | string | null): string | null;
    parsePageQuery(query: TaskOmniPageQuery): {
        startRow: number;
        endRow: number;
        skip: number;
        take: number;
    };
    buildPage<T>(nodes: T[], startRow: number, count: number): {
        list: T[];
        nodes: T[];
        pageData: {
            count: number;
            endRow: number;
            startRow: number;
        };
    };
    slugify(value?: string | null): string | null;
    private parseInteger;
    private getPayload;
    private getPayloadString;
    private getPayloadDate;
    private getPayloadBoolean;
}
