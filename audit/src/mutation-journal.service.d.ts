import { OnApplicationBootstrap } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import type { IMutationJournalDriver, MutationJournalDriverInstallOptions, MutationJournalInstallReport, MutationJournalTargetRef } from './mutation-journal.interface.js';
import type { ResolvedMutationJournalOptions } from './mutation-journal.module.js';
export interface ResolvedMutationJournalTarget {
    dataSource: DataSource;
    driver: IMutationJournalDriver;
    target: MutationJournalTargetRef;
}
interface MutationJournalModuleRef {
    get<TResult>(token: string | symbol | Function, options: {
        strict: boolean;
    }): TResult | undefined;
}
export declare class MutationJournalService implements OnApplicationBootstrap {
    private readonly moduleRef;
    private readonly options;
    private readonly drivers;
    private readonly logger;
    private reports;
    constructor(moduleRef: MutationJournalModuleRef, options: ResolvedMutationJournalOptions, drivers: IMutationJournalDriver[]);
    onApplicationBootstrap(): Promise<void>;
    install(): Promise<MutationJournalInstallReport[]>;
    refresh(): Promise<MutationJournalInstallReport[]>;
    uninstall(): Promise<void>;
    getReports(): MutationJournalInstallReport[];
    getTargets(): MutationJournalTargetRef[];
    getDriverOptions(): MutationJournalDriverInstallOptions;
    resolveTarget(target?: MutationJournalTargetRef): Promise<ResolvedMutationJournalTarget | undefined>;
    private installTarget;
    private getTargetName;
    private getErrorMessage;
}
export {};
