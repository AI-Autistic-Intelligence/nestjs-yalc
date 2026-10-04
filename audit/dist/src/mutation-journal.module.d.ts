import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import type { MutationJournalOptions, MutationJournalTargetRef } from './mutation-journal.interface.js';
export interface ResolvedMutationJournalOptions extends MutationJournalOptions {
    targets: MutationJournalTargetRef[];
    excludedTables: string[];
    journalTableName: string;
}
export interface MutationJournalModuleAsyncOptions {
    imports?: ModuleMetadata['imports'];
    inject?: FactoryProvider['inject'];
    useFactory: (...args: unknown[]) => MutationJournalOptions | Promise<MutationJournalOptions>;
}
export declare class MutationJournalModule {
    static forRoot(options: MutationJournalOptions): DynamicModule;
    static forRootAsync(options: MutationJournalModuleAsyncOptions): DynamicModule;
    private static createDynamicModule;
    private static normalizeOptions;
}
