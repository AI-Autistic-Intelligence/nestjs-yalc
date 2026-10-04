import type { MutationJournalDriverInstallOptions, MutationJournalReadFilter, MutationJournalRow, MutationJournalTargetRef } from './mutation-journal.interface.js';
import { type ResolvedMutationJournalTarget } from './mutation-journal.service.js';
interface MutationJournalQueryPort {
    getDriverOptions(): MutationJournalDriverInstallOptions;
    resolveTarget(target: MutationJournalTargetRef | undefined): Promise<ResolvedMutationJournalTarget | undefined>;
}
export interface ParsedMutationJournalRow extends MutationJournalRow {
    old: unknown | null;
    new: unknown | null;
}
export declare function parseMutationJournalRow(row: MutationJournalRow): ParsedMutationJournalRow;
export declare class MutationJournalQueryService {
    private readonly mutationJournalService;
    constructor(mutationJournalService: MutationJournalQueryPort);
    find(target: MutationJournalTargetRef | undefined, filter: MutationJournalReadFilter): Promise<MutationJournalRow[]>;
}
export {};
