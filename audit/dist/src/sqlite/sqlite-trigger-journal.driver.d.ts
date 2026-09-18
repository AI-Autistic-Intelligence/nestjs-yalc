import type { DataSource } from 'typeorm';
import type { IMutationJournalDriver, MutationJournalDriverInstallOptions, MutationJournalInstallReport, MutationJournalReadFilter, MutationJournalRow } from '../mutation-journal.interface.js';
export declare class SqliteTriggerJournalDriver implements IMutationJournalDriver {
    readonly engine = "sqlite";
    supports(dataSource: DataSource): boolean;
    install(dataSource: DataSource, options: MutationJournalDriverInstallOptions): Promise<MutationJournalInstallReport>;
    uninstall(dataSource: DataSource, _options: MutationJournalDriverInstallOptions): Promise<void>;
    cleanup(dataSource: DataSource, options: MutationJournalDriverInstallOptions, olderThanMs: number): Promise<number>;
    read(dataSource: DataSource, options: MutationJournalDriverInstallOptions, filter: MutationJournalReadFilter): Promise<MutationJournalRow[]>;
    private getTableSkipReason;
    private getColumnSkipReason;
    private dropJournalTriggers;
    private createJournalTable;
    private createJournalTriggers;
}
