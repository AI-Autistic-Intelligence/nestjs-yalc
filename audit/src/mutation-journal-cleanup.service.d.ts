import { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import type { MutationJournalDriverInstallOptions, MutationJournalTargetRef } from './mutation-journal.interface.js';
import type { ResolvedMutationJournalOptions } from './mutation-journal.module.js';
import { type ResolvedMutationJournalTarget } from './mutation-journal.service.js';
interface MutationJournalCleanupPort {
    getDriverOptions(): MutationJournalDriverInstallOptions;
    getTargets(): MutationJournalTargetRef[];
    resolveTarget(target: MutationJournalTargetRef): Promise<ResolvedMutationJournalTarget | undefined>;
}
export declare class MutationJournalCleanupService implements OnApplicationBootstrap, OnModuleDestroy {
    private readonly mutationJournalService;
    private readonly options;
    private readonly logger;
    private timer?;
    constructor(mutationJournalService: MutationJournalCleanupPort, options: ResolvedMutationJournalOptions);
    onApplicationBootstrap(): void;
    onModuleDestroy(): void;
    runOnce(): Promise<number>;
}
export {};
